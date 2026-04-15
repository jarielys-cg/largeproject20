import 'package:flutter/material.dart';
import '../models/business.dart';
import '../models/review.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../widgets/review_card.dart';
import '../widgets/star_rating.dart';
import 'write_review_screen.dart';

class BusinessDetailScreen extends StatefulWidget {
  final Business business;

  const BusinessDetailScreen({super.key, required this.business});

  @override
  State<BusinessDetailScreen> createState() => _BusinessDetailScreenState();
}

class _BusinessDetailScreenState extends State<BusinessDetailScreen> {
  List<Review> _reviews = [];
  bool _loadingReviews = false;
  int _reviewPage = 1;
  int _totalReviewPages = 1;
  User? _user;

  @override
  void initState() {
    super.initState();
    _loadUser();
    _loadReviews();
  }

  Future<void> _loadUser() async {
    final user = await AuthService.getCachedUser();
    if (mounted) setState(() => _user = user);
  }

  Future<void> _loadReviews({int page = 1}) async {
    setState(() => _loadingReviews = true);
    final result = await ApiService.getReviews(widget.business.id, page: page);
    if (!mounted) return;
    setState(() {
      _loadingReviews = false;
      if (result['success']) {
        if (page == 1) {
          _reviews = result['reviews'];
        } else {
          _reviews.addAll(result['reviews']);
        }
        _reviewPage = page;
        _totalReviewPages = result['totalPages'];
      }
    });
  }

  Future<void> _editReview(Review review) async {
    final reviewCtrl = TextEditingController(text: review.review);
    int rating = review.rating;
    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setStateDialog) => AlertDialog(
          title: const Text('Edit Review'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: List.generate(5, (i) => GestureDetector(
                  onTap: () => setStateDialog(() => rating = i + 1),
                  child: Icon(i < rating ? Icons.star : Icons.star_border, color: Colors.amber, size: 32),
                )),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: reviewCtrl,
                maxLines: 4,
                decoration: const InputDecoration(border: OutlineInputBorder(), hintText: 'Your review (min 80 characters)...'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                if (reviewCtrl.text.trim().length < 80) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Review must be at least 80 characters')));
                  return;
                }
                Navigator.pop(ctx);
                final result = await ApiService.updateReview(review.id, rating, reviewCtrl.text.trim());
                if (!mounted) return;
                if (result['success']) {
                  _loadReviews();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['error'])));
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF26B5B), foregroundColor: Colors.white),
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
    reviewCtrl.dispose();
  }

  Future<void> _deleteReview(String reviewId) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete Review'),
        content: const Text('Are you sure you want to delete this review?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (confirmed != true) return;
    final result = await ApiService.deleteReview(reviewId);
    if (!mounted) return;
    if (result['success']) {
      _loadReviews();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['error'])));
    }
  }

  @override
  Widget build(BuildContext context) {
    final b = widget.business;
    return Scaffold(
      appBar: AppBar(
        title: Text(b.name),
        backgroundColor: const Color(0xFFF26B5B),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (b.image.isNotEmpty)
              SizedBox(
                height: 220,
                child: PageView.builder(
                  itemCount: b.image.length,
                  itemBuilder: (_, i) => Image.network(b.image[i], fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: Colors.grey[200], child: const Icon(Icons.store, size: 64))),
                ),
              )
            else
              Container(height: 160, color: Colors.grey[200], child: const Center(child: Icon(Icons.store, size: 64, color: Colors.grey))),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(b.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  if (b.category.isNotEmpty)
                    Wrap(
                      spacing: 6,
                      children: b.category.map((c) => Chip(label: Text(c), padding: EdgeInsets.zero)).toList(),
                    ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      StarRating(rating: b.averageReviewScore, size: 22),
                      const SizedBox(width: 8),
                      Text('${b.averageReviewScore.toStringAsFixed(1)} (${b.reviewCount} reviews)',
                          style: const TextStyle(fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (b.description != null && b.description!.isNotEmpty)
                    Text(b.description!, style: const TextStyle(fontSize: 15)),
                  const SizedBox(height: 12),
                  if (b.address != null) _infoRow(Icons.location_on_outlined, '${b.address}, ${b.city ?? ''}, ${b.state ?? ''} ${b.zipCode?.toString() ?? ''}'),
                  if (b.phone != null) _infoRow(Icons.phone_outlined, b.phone!),
                  if (b.websiteLink != null) _infoRow(Icons.link, b.websiteLink!),
                ],
              ),
            ),
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  const Text('Reviews', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const Spacer(),
                  if (_user != null && !_user!.isBusinessOwner)
                    TextButton.icon(
                      icon: const Icon(Icons.rate_review_outlined),
                      label: const Text('Write Review'),
                      onPressed: () async {
                        await Navigator.push(context, MaterialPageRoute(builder: (_) => WriteReviewScreen(business: b)));
                        _loadReviews();
                      },
                    ),
                ],
              ),
            ),
            if (_loadingReviews && _reviews.isEmpty)
              const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator()))
            else if (_reviews.isEmpty)
              const Padding(padding: EdgeInsets.all(24), child: Center(child: Text('No reviews yet')))
            else
              Column(
                children: [
                  ..._reviews.map((r) => ReviewCard(
                    review: r,
                    currentUserId: _user?.id,
                    onEdit: () => _editReview(r),
                    onDelete: () => _deleteReview(r.id),
                  )),
                  if (_reviewPage < _totalReviewPages)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: TextButton(
                        onPressed: () => _loadReviews(page: _reviewPage + 1),
                        child: const Text('Load more reviews'),
                      ),
                    ),
                  SizedBox(height: MediaQuery.of(context).padding.bottom + 24),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: Colors.grey[600]),
          const SizedBox(width: 8),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 14))),
        ],
      ),
    );
  }
}
