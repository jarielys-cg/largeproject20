import 'package:flutter/material.dart';
import '../models/business.dart';
import '../services/api_service.dart';
import '../widgets/business_card.dart';
import 'add_edit_business_screen.dart';
import 'business_detail_screen.dart';

class MyBusinessesScreen extends StatefulWidget {
  const MyBusinessesScreen({super.key});

  @override
  State<MyBusinessesScreen> createState() => _MyBusinessesScreenState();
}

class _MyBusinessesScreenState extends State<MyBusinessesScreen> {
  List<Business> _businesses = [];
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final businesses = await ApiService.getMyBusinesses();
    if (!mounted) return;
    setState(() {
      _businesses = businesses;
      _loading = false;
    });
  }

  Future<void> _delete(Business b) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Remove Business'),
        content: Text('Remove "${b.name}"?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Remove', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (confirmed != true) return;
    final result = await ApiService.removeBusiness(b.id);
    if (!mounted) return;
    if (result['success']) {
      _load();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['error'])));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Businesses'),
        backgroundColor: const Color(0xFF1976D2),
        foregroundColor: Colors.white,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await Navigator.push(context, MaterialPageRoute(builder: (_) => const AddEditBusinessScreen()));
          _load();
        },
        backgroundColor: const Color(0xFF1976D2),
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _businesses.isEmpty
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.store_outlined, size: 64, color: Colors.grey),
                      const SizedBox(height: 12),
                      const Text('No businesses yet'),
                      const SizedBox(height: 8),
                      ElevatedButton(
                        onPressed: () async {
                          await Navigator.push(context, MaterialPageRoute(builder: (_) => const AddEditBusinessScreen()));
                          _load();
                        },
                        child: const Text('Add Your First Business'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    itemCount: _businesses.length,
                    itemBuilder: (context, index) {
                      final b = _businesses[index];
                      return Stack(
                        children: [
                          BusinessCard(
                            business: b,
                            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => BusinessDetailScreen(business: b))),
                          ),
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.edit_outlined, size: 20),
                                  onPressed: () async {
                                    await Navigator.push(context, MaterialPageRoute(builder: (_) => AddEditBusinessScreen(business: b)));
                                    _load();
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, size: 20, color: Colors.red),
                                  onPressed: () => _delete(b),
                                ),
                              ],
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
    );
  }
}
