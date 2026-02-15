import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../app.dart';
import '../services/api_client.dart';
import '../widgets/primary_button.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({Key? key}) : super(key: key);

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  final _nameController = TextEditingController();
  final _categoryController = TextEditingController();
  final _imageController = TextEditingController();
  final ImagePicker _picker = ImagePicker();

  bool _isLoading = false;
  String? _error;
  Map<String, dynamic>? _result;
  File? _imageFile;

  @override
  void dispose() {
    _nameController.dispose();
    _categoryController.dispose();
    _imageController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    final picked = await _picker.pickImage(source: source, imageQuality: 80);
    if (picked == null) {
      return;
    }
    setState(() {
      _imageFile = File(picked.path);
      _imageController.text = '';
    });
  }

  Future<void> _submit() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    final session = AppScope.of(context);
    try {
      if (_imageFile == null &&
          (_nameController.text.trim().isEmpty ||
              _categoryController.text.trim().isEmpty)) {
        throw ApiException('Name and category are required without an image');
      }

      final result = _imageFile != null
          ? await session.deviceService.classifyDeviceWithImage(
              name: _nameController.text,
              category: _categoryController.text,
              imagePath: _imageFile!.path,
            )
          : await session.deviceService.classifyDevice(
              name: _nameController.text,
              category: _categoryController.text,
              imageUrl: _imageController.text.isEmpty
                  ? null
                  : _imageController.text,
            );
      if (mounted) {
        setState(() {
          _result = result;
          _isLoading = false;
        });
      }
    } on ApiException catch (err) {
      if (mounted) {
        setState(() {
          _error = err.message;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _error = 'Scan failed.';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _isLoading ? null : () => _pickImage(ImageSource.camera),
                icon: const Icon(Icons.photo_camera_outlined),
                label: const Text('Take photo'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _isLoading ? null : () => _pickImage(ImageSource.gallery),
                icon: const Icon(Icons.photo_library_outlined),
                label: const Text('Gallery'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (_imageFile != null)
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.file(
              _imageFile!,
              height: 180,
              fit: BoxFit.cover,
            ),
          ),
        if (_imageFile != null) const SizedBox(height: 12),
        TextField(
          controller: _nameController,
          decoration: const InputDecoration(
            labelText: 'Device name',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _categoryController,
          decoration: const InputDecoration(
            labelText: 'Category',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _imageController,
          decoration: const InputDecoration(
            labelText: 'Image URL (optional)',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
        PrimaryButton(
          label: 'Classify device',
          isLoading: _isLoading,
          onPressed: _isLoading ? null : _submit,
        ),
        const SizedBox(height: 24),
        if (_result != null)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Result', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 8),
                  Text(_result?['classificationResults']?.toString() ?? ''),
                  const SizedBox(height: 8),
                  Text('Hazard level: ${_result?['hazardLevel'] ?? ''}'),
                  const SizedBox(height: 8),
                  Text('Recommendations:'),
                  const SizedBox(height: 4),
                  for (final item in (_result?['recommendations'] as List<dynamic>? ?? []))
                    Text('- ${item.toString()}'),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
