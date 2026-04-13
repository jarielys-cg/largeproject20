class Business {
  final String id;
  final String name;
  final String ownerId;
  final List<String> category;
  final String? description;
  final List<String> image;
  final String? address;
  final String? city;
  final String? state;
  final int? zipCode;
  final String? phone;
  final String? websiteLink;
  final int reviewCount;
  final double averageReviewScore;

  Business({
    required this.id,
    required this.name,
    required this.ownerId,
    required this.category,
    this.description,
    required this.image,
    this.address,
    this.city,
    this.state,
    this.zipCode,
    this.phone,
    this.websiteLink,
    required this.reviewCount,
    required this.averageReviewScore,
  });

  factory Business.fromJson(Map<String, dynamic> json) {
    return Business(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      ownerId: json['ownerId'] ?? '',
      category: List<String>.from(json['category'] ?? []),
      description: json['description'],
      image: List<String>.from(json['image'] ?? []),
      address: json['address'],
      city: json['city'],
      state: json['state'],
      zipCode: json['zipCode'] != null ? int.tryParse(json['zipCode'].toString()) : null,
      phone: json['phone'],
      websiteLink: json['websiteLink'],
      reviewCount: json['reviewCount'] ?? 0,
      averageReviewScore: (json['averageReviewScore'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'category': category,
      'description': description,
      'address': address,
      'city': city,
      'state': state,
      'zipCode': zipCode,
      'phone': phone,
      'websiteLink': websiteLink,
    };
  }
}
