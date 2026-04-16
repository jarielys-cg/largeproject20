import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import '../models/business.dart';
import '../services/api_service.dart';

class _PhoneInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final digits = newValue.text.replaceAll(RegExp(r'[^\d]'), '');
    if (digits.isEmpty) return newValue.copyWith(text: '');
    final buf = StringBuffer();
    for (int i = 0; i < digits.length && i < 10; i++) {
      if (i == 0) buf.write('(');
      if (i == 3) buf.write(') ');
      if (i == 6) buf.write('-');
      buf.write(digits[i]);
    }
    final formatted = buf.toString();
    return newValue.copyWith(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

const List<String> kCategories = [
  'Restaurants',
  'Shopping',
  'Automotive',
  'Home Services',
  'Beauty & Spas',
];

class AddEditBusinessScreen extends StatefulWidget {
  final Business? business;

  const AddEditBusinessScreen({super.key, this.business});

  @override
  State<AddEditBusinessScreen> createState() => _AddEditBusinessScreenState();
}

class _AddEditBusinessScreenState extends State<AddEditBusinessScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameCtrl;
  late final TextEditingController _descCtrl;
  late final TextEditingController _addressCtrl;
  late final TextEditingController _cityCtrl;
  late final TextEditingController _stateCtrl;
  late final TextEditingController _zipCtrl;
  late final TextEditingController _phoneCtrl;
  late final TextEditingController _websiteCtrl;
  List<String> _selectedCategories = [];
  List<String> _images = [];
  bool _loading = false;
  bool _uploadingImage = false;
  bool _pickingImage = false;
  String? _error;

  bool get _isEditing => widget.business != null;

  @override
  void initState() {
    super.initState();
    final b = widget.business;
    _nameCtrl = TextEditingController(text: b?.name ?? '');
    _descCtrl = TextEditingController(text: b?.description ?? '');
    _addressCtrl = TextEditingController(text: b?.address ?? '');
    _cityCtrl = TextEditingController(text: b?.city ?? '');
    _stateCtrl = TextEditingController(text: b?.state ?? '');
    _zipCtrl = TextEditingController(text: b?.zipCode?.toString() ?? '');
    _phoneCtrl = TextEditingController(text: b?.phone ?? '');
    _websiteCtrl = TextEditingController(text: b?.websiteLink ?? '');
    _selectedCategories = List.from(b?.category ?? []);
    _images = List.from(b?.image ?? []);
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _descCtrl.dispose();
    _addressCtrl.dispose();
    _cityCtrl.dispose();
    _stateCtrl.dispose();
    _zipCtrl.dispose();
    _phoneCtrl.dispose();
    _websiteCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickAndUploadImage() async {
    if (_pickingImage || _uploadingImage) return;
    setState(() => _pickingImage = true);
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
    setState(() => _pickingImage = false);
    if (picked == null || !mounted) return;
    setState(() => _uploadingImage = true);
    final result = await ApiService.uploadBusinessImage(_nameCtrl.text.trim(), File(picked.path));
    if (!mounted) return;
    setState(() => _uploadingImage = false);
    if (result['success']) {
      // Refresh business to get updated image list
      final updated = await ApiService.getBusinessById(widget.business!.id);
      if (!mounted) return;
      if (updated != null) setState(() => _images = List.from(updated.image));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['error'] ?? 'Upload failed')));
    }
  }

  Future<void> _removeImage(String imageUrl) async {
    // Extract key from URL
    final key = imageUrl.replaceFirst('https://marketplacegroup20.sfo3.digitaloceanspaces.com/', '');
    final result = await ApiService.removeBusinessImage(_nameCtrl.text.trim(), key);
    if (!mounted) return;
    if (result['success']) {
      setState(() => _images.remove(imageUrl));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['error'] ?? 'Remove failed')));
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategories.isEmpty) {
      setState(() => _error = 'Select at least one category');
      return;
    }
    setState(() { _loading = true; _error = null; });

    final body = {
      'name': _nameCtrl.text.trim(),
      'category': _selectedCategories,
      'description': _descCtrl.text.trim(),
      'address': _addressCtrl.text.trim(),
      'city': _cityCtrl.text.trim(),
      'state': _stateCtrl.text.trim(),
      'zipCode': int.tryParse(_zipCtrl.text.trim()),
      'phone': _phoneCtrl.text.trim(),
      'websiteLink': _websiteCtrl.text.trim(),
    };

    Map<String, dynamic> result;
    if (_isEditing) {
      result = await ApiService.editBusiness(widget.business!.id, body);
    } else {
      result = await ApiService.addBusiness(body);
    }

    if (!mounted) return;
    setState(() => _loading = false);
    if (result['success']) {
      Navigator.pop(context);
    } else {
      setState(() => _error = result['error']);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Edit Business' : 'Add Business'),
        backgroundColor: const Color(0xFFF26B5B),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (_error != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(color: Colors.red[50], borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.red[200]!)),
                  child: Text(_error!, style: const TextStyle(color: Colors.red)),
                ),
              _field(_nameCtrl, 'Business Name', required: true),
              const SizedBox(height: 14),
              _field(_descCtrl, 'Description', maxLines: 3),
              const SizedBox(height: 14),
              const Text('Categories', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: kCategories.map((cat) {
                  final selected = _selectedCategories.contains(cat);
                  return FilterChip(
                    label: Text(cat),
                    selected: selected,
                    onSelected: (val) => setState(() {
                      if (val) {
                        _selectedCategories.add(cat);
                      } else {
                        _selectedCategories.remove(cat);
                      }
                    }),
                    selectedColor: const Color(0xFFF26B5B).withOpacity(0.2),
                    checkmarkColor: const Color(0xFFF26B5B),
                    labelStyle: TextStyle(
                      color: selected ? const Color(0xFFF26B5B) : Colors.black87,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
                    ),
                    side: BorderSide(color: selected ? const Color(0xFFF26B5B) : Colors.grey[300]!),
                  );
                }).toList(),
              ),
              const SizedBox(height: 14),
              _field(_addressCtrl, 'Address'),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(child: _field(_cityCtrl, 'City')),
                  const SizedBox(width: 12),
                  SizedBox(width: 80, child: _field(_stateCtrl, 'State')),
                ],
              ),
              const SizedBox(height: 14),
              _field(_zipCtrl, 'Zip Code', keyboardType: TextInputType.number),
              const SizedBox(height: 14),
              TextFormField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                inputFormatters: [_PhoneInputFormatter()],
                decoration: const InputDecoration(
                  labelText: 'Phone',
                  hintText: '(555) 555-5555',
                  border: OutlineInputBorder(),
                ),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return null;
                  final phoneRegex = RegExp(r'^\(\d{3}\) \d{3}-\d{4}$');
                  if (!phoneRegex.hasMatch(v.trim())) return 'Format: (###) ###-####';
                  return null;
                },
              ),
              const SizedBox(height: 14),
              _field(_websiteCtrl, 'Website', keyboardType: TextInputType.url),
              if (_isEditing) ...[
                const SizedBox(height: 14),
                const Text('Photos', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                if (_images.isNotEmpty)
                  SizedBox(
                    height: 100,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _images.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (_, i) => Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(_images[i], width: 100, height: 100, fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(width: 100, height: 100, color: Colors.grey[200], child: const Icon(Icons.broken_image))),
                          ),
                          Positioned(
                            top: 2,
                            right: 2,
                            child: GestureDetector(
                              onTap: () => _removeImage(_images[i]),
                              child: Container(
                                decoration: const BoxDecoration(color: Colors.black54, shape: BoxShape.circle),
                                child: const Icon(Icons.close, color: Colors.white, size: 18),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  onPressed: (_pickingImage || _uploadingImage) ? null : _pickAndUploadImage,
                  icon: (_pickingImage || _uploadingImage)
                      ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                      : const Icon(Icons.add_photo_alternate_outlined),
                  label: Text(_uploadingImage ? 'Uploading...' : 'Add Photo'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFFF26B5B),
                    side: const BorderSide(color: Color(0xFFF26B5B)),
                  ),
                ),
              ],
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _loading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF26B5B),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: _loading
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : Text(_isEditing ? 'Save Changes' : 'Add Business', style: const TextStyle(fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _field(
    TextEditingController ctrl,
    String label, {
    bool required = false,
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextFormField(
      controller: ctrl,
      maxLines: maxLines,
      keyboardType: keyboardType,
      decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
      validator: required ? (v) => v == null || v.trim().isEmpty ? 'Required' : null : null,
    );
  }
}
