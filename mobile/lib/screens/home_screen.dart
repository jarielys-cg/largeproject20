import 'package:flutter/material.dart';
import '../models/business.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../widgets/business_card.dart';
import 'business_detail_screen.dart';
import 'login_screen.dart';
import 'my_businesses_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchCtrl = TextEditingController();
  List<Business> _businesses = [];
  bool _loading = false;
  int _page = 1;
  int _totalPages = 1;
  User? _user;

  @override
  void initState() {
    super.initState();
    _loadUser();
    _search('');
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadUser() async {
    final user = await AuthService.getCachedUser();
    if (mounted) setState(() => _user = user);
  }

  Future<void> _search(String query, {int page = 1}) async {
    setState(() => _loading = true);
    final result = await ApiService.searchBusinesses(query, page: page);
    if (!mounted) return;
    setState(() {
      _loading = false;
      if (result['success']) {
        _businesses = result['businesses'];
        _totalPages = result['totalPages'];
        _page = result['page'];
      }
    });
  }

  Future<void> _logout() async {
    await AuthService.logout();
    if (!mounted) return;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (_) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('BizMart', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1976D2),
        foregroundColor: Colors.white,
        actions: [
          if (_user?.isBusinessOwner == true)
            IconButton(
              icon: const Icon(Icons.store),
              tooltip: 'My Businesses',
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const MyBusinessesScreen())),
            ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: _logout,
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchCtrl,
              textInputAction: TextInputAction.search,
              onSubmitted: (v) => _search(v),
              decoration: InputDecoration(
                hintText: 'Search businesses...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchCtrl.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchCtrl.clear();
                          _search('');
                        },
                      )
                    : null,
                filled: true,
                fillColor: Colors.grey[100],
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
              onChanged: (_) => setState(() {}),
            ),
          ),
          if (_loading)
            const Expanded(child: Center(child: CircularProgressIndicator()))
          else if (_businesses.isEmpty)
            const Expanded(child: Center(child: Text('No businesses found')))
          else
            Expanded(
              child: RefreshIndicator(
                onRefresh: () => _search(_searchCtrl.text),
                child: ListView.builder(
                  itemCount: _businesses.length + (_page < _totalPages ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index == _businesses.length) {
                      return Center(
                        child: TextButton(
                          onPressed: () => _search(_searchCtrl.text, page: _page + 1),
                          child: const Text('Load more'),
                        ),
                      );
                    }
                    return BusinessCard(
                      business: _businesses[index],
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => BusinessDetailScreen(business: _businesses[index])),
                      ),
                    );
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }
}
