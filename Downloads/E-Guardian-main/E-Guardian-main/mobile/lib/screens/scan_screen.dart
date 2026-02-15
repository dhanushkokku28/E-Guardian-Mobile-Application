import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../app.dart';
import '../models/models.dart';
import '../services/api_client.dart';
import '../theme/app_theme.dart';
import '../utils/utils.dart';
import '../widgets/primary_button.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({Key? key}) : super(key: key);

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  final _nameController = TextEditingController();
  String _selectedCategory = Constants.deviceCategories.first;
  final ImagePicker _picker = ImagePicker();

  bool _isLoading = false;
  String? _error;
  Map<String, dynamic>? _result;
  File? _imageFile;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final picked = await _picker.pickImage(source: source, imageQuality: 80);
      if (picked == null) return;

      final imageFile = File(picked.path);

      if (!ImageUtils.isValidImageSize(imageFile)) {
        _showError('Image size must be less than 5MB');
        return;
      }

      setState(() {
        _imageFile = imageFile;
        _error = null;
      });
    } catch (e) {
      _showError(ErrorHandler.getErrorMessage(e));
    }
  }

  Future<void> _submit() async {
    if (!_validateInputs()) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    final session = AppScope.of(context);
    try {
      final result = _imageFile != null
          ? await session.deviceService.classifyDeviceWithImage(
              name: _nameController.text,
              category: _selectedCategory,
              imagePath: _imageFile!.path,
            )
          : await session.deviceService.classifyDevice(
              name: _nameController.text,
              category: _selectedCategory,
            );

      if (mounted) {
        setState(() {
          _result = result;
          _isLoading = false;
        });
        _showSuccess('Device classified successfully!');
      }
    } on ApiException catch (err) {
      _showError(err.message);
    } catch (e) {
      _showError(ErrorHandler.getErrorMessage(e));
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  bool _validateInputs() {
    if (!ValidationUtils.isValidDeviceName(_nameController.text)) {
      _showError('Please enter a device name');
      return false;
    }
    if (!ValidationUtils.isValidCategory(_selectedCategory)) {
      _showError('Please select a category');
      return false;
    }
    return true;
  }

  void _showError(String message) {
    setState(() => _error = message);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.hazardHigh,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.hazardLow,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Device Classification',
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              Text('Take a photo or select an image to classify your device.',
                  style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(height: 20),
              _buildImageSection(),
              const SizedBox(height: 24),
              _buildDeviceForm(),
              const SizedBox(height: 24),
              if (_result != null) _buildResultCard(),
            ],
          ),
        ),
      ),
      floatingActionButton: _imageFile == null
          ? FloatingActionButton.extended(
              onPressed: () => _showCameraOptions(context),
              label: const Text('Capture Device'),
              icon: const Icon(Icons.camera_alt_outlined),
            )
          : null,
    );
  }

  Widget _buildImageSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            if (_imageFile == null)
              Column(
                children: [
                  Icon(Icons.image_outlined,
                      size: 64, color: AppTheme.lightGreen),
                  const SizedBox(height: 12),
                  Text('No image selected',
                      style: Theme.of(context).textTheme.bodyMedium),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _isLoading
                              ? null
                              : () => _pickImage(ImageSource.camera),
                          icon: const Icon(Icons.photo_camera_outlined),
                          label: const Text('Camera'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _isLoading
                              ? null
                              : () => _pickImage(ImageSource.gallery),
                          icon: const Icon(Icons.photo_library_outlined),
                          label: const Text('Gallery'),
                        ),
                      ),
                    ],
                  ),
                ],
              )
            else
              Column(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.file(
                      _imageFile!,
                      height: 200,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _isLoading
                              ? null
                              : () => _pickImage(ImageSource.camera),
                          icon: const Icon(Icons.refresh),
                          label: const Text('Retake'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _isLoading
                              ? null
                              : () => setState(() => _imageFile = null),
                          icon: const Icon(Icons.delete_outlined),
                          label: const Text('Remove'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeviceForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Device Details', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        TextField(
          controller: _nameController,
          decoration: InputDecoration(
            labelText: 'Device Name',
            hintText: 'e.g., iPhone 12, Dell Laptop',
            prefixIcon: const Icon(Icons.devices_outlined),
            enabled: !_isLoading,
          ),
        ),
        const SizedBox(height: 12),
        DropdownButtonFormField<String>(
          value: _selectedCategory,
          decoration: InputDecoration(
            labelText: 'Category',
            prefixIcon: const Icon(Icons.category_outlined),
          ),
          items: Constants.deviceCategories
              .map((category) => DropdownMenuItem(
                    value: category,
                    child: Text(
                        '${Constants.deviceEmojis[category] ?? ''} $category'),
                  ))
              .toList(),
          onChanged: _isLoading
              ? null
              : (value) => setState(() => _selectedCategory = value!),
        ),
        const SizedBox(height: 16),
        if (_error != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.hazardHigh.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppTheme.hazardHigh),
              ),
              child: Text(
                _error!,
                style: TextStyle(color: AppTheme.hazardHigh),
              ),
            ),
          ),
        PrimaryButton(
          label: 'Classify Device',
          isLoading: _isLoading,
          onPressed: _isLoading ? null : _submit,
        ),
      ],
    );
  }

  Widget _buildResultCard() {
    return Card(
      color: AppTheme.hazardLow.withOpacity(0.05),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.check_circle, color: AppTheme.hazardLow),
                const SizedBox(width: 12),
                Text('Classification Complete',
                    style: Theme.of(context).textTheme.titleMedium),
              ],
            ),
            const SizedBox(height: 12),
            Text(_result?['classificationResults']?.toString() ?? ''),
            const SizedBox(height: 12),
            _buildHazardBadge(),
            const SizedBox(height: 12),
            if (_result?['recommendations'] != null)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Recommendations',
                      style: Theme.of(context).textTheme.titleSmall),
                  const SizedBox(height: 8),
                  for (final item
                      in (_result?['recommendations'] as List<dynamic>))
                    Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        children: [
                          const Icon(Icons.check_small,
                              color: AppTheme.hazardLow),
                          Expanded(child: Text(item.toString())),
                        ],
                      ),
                    ),
                ],
              ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {
                  setState(() {
                    _result = null;
                    _imageFile = null;
                    _nameController.clear();
                    _selectedCategory = Constants.deviceCategories.first;
                  });
                },
                child: const Text('Classify Another Device'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHazardBadge() {
    final hazardLevel = _result?['hazardLevel']?.toString() ?? 'Low';
    final hazardEnum = HazardLevelExtension.fromString(hazardLevel);

    Color badgeColor;
    Color textColor;
    IconData icon;

    switch (hazardEnum) {
      case HazardLevel.high:
        badgeColor = AppTheme.hazardHigh;
        textColor = Colors.white;
        icon = Icons.warning_rounded;
        break;
      case HazardLevel.medium:
        badgeColor = AppTheme.hazardMedium;
        textColor = Colors.white;
        icon = Icons.info_rounded;
        break;
      case HazardLevel.low:
        badgeColor = AppTheme.hazardLow;
        textColor = Colors.white;
        icon = Icons.check_circle_rounded;
        break;
    }

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: badgeColor.withOpacity(0.1),
        border: Border.all(color: badgeColor, width: 2),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(icon, color: badgeColor),
          const SizedBox(width: 8),
          Text('Hazard Level: $hazardLevel',
              style: TextStyle(color: badgeColor, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  void _showCameraOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt_outlined),
              title: const Text('Take Photo'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Choose from Gallery'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}
