class User {
  final String id;
  final String firstName;
  final String lastName;
  final String username;
  final String email;
  final bool isBusinessOwner;
  final int? zipCode;

  User({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.username,
    required this.email,
    required this.isBusinessOwner,
    this.zipCode,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      isBusinessOwner: json['isBusinessOwner'] ?? false,
      zipCode: json['zipCode'],
    );
  }
}
