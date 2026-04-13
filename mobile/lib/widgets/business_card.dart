import 'package:flutter/material.dart';
import '../models/business.dart';
import 'star_rating.dart';

class BusinessCard extends StatelessWidget {
  final Business business;
  final VoidCallback onTap;

  const BusinessCard({super.key, required this.business, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: business.image.isNotEmpty
                    ? Image.network(
                        business.image.first,
                        width: 72,
                        height: 72,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => _placeholder(),
                      )
                    : _placeholder(),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(business.name,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    if (business.category.isNotEmpty)
                      Text(business.category.join(', '),
                          style: TextStyle(fontSize: 13, color: Colors.grey[600])),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        StarRating(rating: business.averageReviewScore),
                        const SizedBox(width: 6),
                        Text('(${business.reviewCount})',
                            style: TextStyle(fontSize: 13, color: Colors.grey[600])),
                      ],
                    ),
                    if (business.city != null && business.state != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text('${business.city}, ${business.state}',
                            style: TextStyle(fontSize: 12, color: Colors.grey[500])),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _placeholder() {
    return Container(
      width: 72,
      height: 72,
      color: Colors.grey[200],
      child: const Icon(Icons.store, color: Colors.grey, size: 36),
    );
  }
}
