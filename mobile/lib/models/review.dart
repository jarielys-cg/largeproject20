class Review {
  final String id;
  final String businessId;
  final String userId;
  final int rating;
  final String review;
  final DateTime? createdAt;

  Review({
    required this.id,
    required this.businessId,
    required this.userId,
    required this.rating,
    required this.review,
    this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['_id'] ?? '',
      businessId: json['businessId'] ?? '',
      userId: json['userId'] ?? '',
      rating: json['rating'] ?? 0,
      review: json['review'] ?? '',
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
    );
  }
}
