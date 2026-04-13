import 'package:flutter/material.dart';
import '../models/review.dart';
import 'star_rating.dart';

class ReviewCard extends StatelessWidget {
  final Review review;
  final String? currentUserId;
  final VoidCallback? onDelete;

  const ReviewCard({
    super.key,
    required this.review,
    this.currentUserId,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final isOwner = currentUserId != null && currentUserId == review.userId;
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                StarRating(rating: review.rating.toDouble()),
                const Spacer(),
                if (isOwner && onDelete != null)
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                    onPressed: onDelete,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            Text(review.review, style: const TextStyle(fontSize: 14)),
            if (review.createdAt != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  '${review.createdAt!.month}/${review.createdAt!.day}/${review.createdAt!.year}',
                  style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
