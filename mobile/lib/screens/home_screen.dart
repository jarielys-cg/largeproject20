import 'dart:async';
import 'package:flutter/material.dart';
import '../main.dart';
import '../models/business.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../widgets/business_card.dart';
import 'business_detail_screen.dart';
import 'login_screen.dart';
import 'my_businesses_screen.dart';

const _heroImages = [
  'assets/images/Restaurant.jpg',
  'assets/images/Barber.jpg',
  'assets/images/HomeServices.jpg',
  'assets/images/Shopping.jpg',
  'assets/images/AutoServices.jpg',
];

const _heroLabels = [
  {'title': 'Grab some grub', 'tag': 'Restaurants'},
  {'title': 'Look your best', 'tag': 'Beauty & Spas'},
  {'title': 'Find a contractor', 'tag': 'Home Services'},
  {'title': 'Shop local', 'tag': 'Shopping'},
  {'title': 'Smooth shifting again', 'tag': 'Auto Services'},
];

const _categories = [
  {'label': 'Restaurants', 'icon': Icons.restaurant_outlined},
  {'label': 'Shopping', 'icon': Icons.shopping_bag_outlined},
  {'label': 'Beauty & Spas', 'icon': Icons.content_cut_outlined},
  {'label': 'Automotive', 'icon': Icons.directions_car_outlined},
  {'label': 'Home Services', 'icon': Icons.home_outlined},
];

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _pageCtrl = PageController();
  List<Business> _businesses = [];
  bool _loading = false;
  int _heroIndex = 0;
  int _page = 1;
  int _totalPages = 1;
  User? _user;
  Timer? _heroTimer;
  bool _searched = false;

  @override
  void initState() {
    super.initState();
    _loadUser();
    _startHeroTimer();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    _locationCtrl.dispose();
    _pageCtrl.dispose();
    _heroTimer?.cancel();
    super.dispose();
  }

  void _startHeroTimer() {
    _heroTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      final next = (_heroIndex + 1) % _heroImages.length;
      _pageCtrl.animateToPage(next, duration: const Duration(milliseconds: 800), curve: Curves.easeInOut);
    });
  }

  Future<void> _loadUser() async {
    final user = await AuthService.getCachedUser();
    if (mounted) setState(() => _user = user);
  }

  Future<void> _search(String query, {int page = 1}) async {
    setState(() { _loading = true; _searched = true; });
    final result = await ApiService.searchBusinesses(query, location: _locationCtrl.text.trim(), page: page);
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
      backgroundColor: Colors.white,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(child: _buildNavbar()),
            SliverToBoxAdapter(child: _buildHero()),
            SliverToBoxAdapter(child: _buildCategories()),
            if (_searched) ...[
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
                  child: Text('Results', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: bmDark)),
                ),
              ),
              if (_loading)
                const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.all(32), child: Center(child: CircularProgressIndicator(color: bmCoral))))
              else if (_businesses.isEmpty)
                const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.all(32), child: Center(child: Text('No businesses found'))))
              else
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      if (index == _businesses.length) {
                        return _page < _totalPages
                            ? Center(child: TextButton(onPressed: () => _search(_searchCtrl.text, page: _page + 1), child: const Text('Load more', style: TextStyle(color: bmCoral))))
                            : const SizedBox(height: 16);
                      }
                      return BusinessCard(
                        business: _businesses[index],
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => BusinessDetailScreen(business: _businesses[index]))),
                      );
                    },
                    childCount: _businesses.length + 1,
                  ),
                ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildNavbar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          const Icon(Icons.store, color: bmCoral, size: 26),
          const SizedBox(width: 6),
          const Text('BizMart', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: bmDark)),
          const Spacer(),
          if (_user?.isBusinessOwner == true)
            TextButton(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const MyBusinessesScreen())),
              child: const Text('For Business', style: TextStyle(color: bmDark, fontSize: 13)),
            ),
          const SizedBox(width: 4),
          OutlinedButton(
            onPressed: _logout,
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: bmCoral),
              foregroundColor: bmCoral,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text('Log out', style: TextStyle(fontSize: 13)),
          ),
        ],
      ),
    );
  }

  Widget _buildHero() {
    return SizedBox(
      height: 300,
      child: Stack(
        children: [
          PageView.builder(
            controller: _pageCtrl,
            itemCount: _heroImages.length,
            onPageChanged: (i) => setState(() => _heroIndex = i),
            itemBuilder: (_, i) => Stack(
              fit: StackFit.expand,
              children: [
                Image.asset(_heroImages[i], fit: BoxFit.cover),
                Container(color: Colors.black.withOpacity(0.45)),
              ],
            ),
          ),
          Positioned.fill(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 700),
                  child: Text(
                    _heroLabels[_heroIndex]['title']!,
                    key: ValueKey(_heroIndex),
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Container(
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8), boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 8)]),
                    child: Row(
                      children: [
                        Expanded(
                          flex: 3,
                          child: TextField(
                            controller: _searchCtrl,
                            decoration: const InputDecoration(
                              hintText: 'restaurants, nail salons...',
                              hintStyle: TextStyle(fontSize: 13),
                              contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        Container(width: 1, height: 36, color: Colors.grey[200]),
                        Expanded(
                          flex: 2,
                          child: TextField(
                            controller: _locationCtrl,
                            decoration: const InputDecoration(
                              hintText: 'Location',
                              hintStyle: TextStyle(fontSize: 13),
                              contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () => _search(_searchCtrl.text),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            decoration: const BoxDecoration(color: bmCoral, borderRadius: BorderRadius.only(topRight: Radius.circular(8), bottomRight: Radius.circular(8))),
                            child: const Icon(Icons.search, color: Colors.white, size: 20),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Padding(
                  padding: const EdgeInsets.only(left: 16),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 700),
                      child: GestureDetector(
                        key: ValueKey(_heroIndex),
                        onTap: () => _search(_heroLabels[_heroIndex]['tag']!),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(color: bmCoral, borderRadius: BorderRadius.circular(20)),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.search, color: Colors.white, size: 14),
                              const SizedBox(width: 6),
                              Text(_heroLabels[_heroIndex]['tag']!, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            bottom: 10,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(_heroImages.length, (i) => AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: i == _heroIndex ? 16 : 8,
                height: 8,
                decoration: BoxDecoration(
                  color: i == _heroIndex ? Colors.white : Colors.white.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(4),
                ),
              )),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategories() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text('Categories', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: bmDark)),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.3,
            children: _categories.map((cat) {
              return GestureDetector(
                onTap: () => _search(cat['label'] as String),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey[200]!),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 4, offset: const Offset(0, 2))],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(color: Colors.grey[100], shape: BoxShape.circle),
                        child: Icon(cat['icon'] as IconData, color: bmCoral, size: 26),
                      ),
                      const SizedBox(height: 10),
                      Text(cat['label'] as String, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF374151))),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
