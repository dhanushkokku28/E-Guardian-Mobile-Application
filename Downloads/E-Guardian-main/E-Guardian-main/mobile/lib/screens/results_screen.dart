import 'package:flutter/material.dart';

import '../app.dart';
import '../config.dart';
import '../services/api_client.dart';

class ResultsScreen extends StatefulWidget {
  const ResultsScreen({Key? key}) : super(key: key);

  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> {
  bool _isLoading = true;
  String? _error;
  List<dynamic> _devices = [];
  String _query = '';
  String _hazardFilter = 'All';
  String _statusFilter = 'All';

  static const List<String> _hazardOptions = ['All', 'Low', 'Medium', 'High'];
  static const List<String> _statusOptions = [
    'All',
    'detected',
    'recycled',
    'disposed'
  ];

  String? _resolveImageUrl(String? imageUrl) {
    if (imageUrl == null || imageUrl.isEmpty) {
      return null;
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    final base = kApiBaseUrl.replaceFirst(RegExp(r'/api/?$'), '');
    return '$base$imageUrl';
  }

  List<dynamic> _filteredDevices() {
    final query = _query.trim().toLowerCase();
    return _devices.where((device) {
      final name = device['name']?.toString().toLowerCase() ?? '';
      final category = device['category']?.toString().toLowerCase() ?? '';
      final hazard = device['hazardLevel']?.toString() ?? '';
      final status = device['status']?.toString() ?? '';

      final matchesQuery =
          query.isEmpty || name.contains(query) || category.contains(query);
      final matchesHazard = _hazardFilter == 'All' || hazard == _hazardFilter;
      final matchesStatus = _statusFilter == 'All' || status == _statusFilter;

      return matchesQuery && matchesHazard && matchesStatus;
    }).toList();
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    final session = AppScope.of(context);
    try {
      final devices = await session.deviceService.getDevices();
      if (mounted) {
        setState(() {
          _devices = devices;
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
          _error = 'Failed to load results.';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return Center(child: Text(_error!));
    }
    final filtered = _filteredDevices();
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'Search devices or categories',
              border: OutlineInputBorder(),
            ),
            onChanged: (value) => setState(() => _query = value),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _hazardOptions
                .map((option) => ChoiceChip(
                      label: Text(option),
                      selected: _hazardFilter == option,
                      onSelected: (_) => setState(() => _hazardFilter = option),
                    ))
                .toList(),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _statusOptions
                .map((option) => ChoiceChip(
                      label: Text(option),
                      selected: _statusFilter == option,
                      onSelected: (_) => setState(() => _statusFilter = option),
                    ))
                .toList(),
          ),
          const SizedBox(height: 16),
          if (filtered.isEmpty) const Text('No results match your filters.'),
          for (final device in filtered)
            _ResultCard(
              device: device as Map<String, dynamic>,
              imageUrl: _resolveImageUrl(device['imageUrl']?.toString()),
              onTap: () => _showDetail(device as Map<String, dynamic>),
            ),
        ],
      ),
    );
  }

  void _showDetail(Map<String, dynamic> device) {
    final imageUrl = _resolveImageUrl(device['imageUrl']?.toString());
    final recommendations =
        (device['recommendations'] as List<dynamic>? ?? []).cast<dynamic>();

    showModalBottomSheet(
      context: context,
      showDragHandle: true,
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: ListView(
            shrinkWrap: true,
            children: [
              if (imageUrl != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    imageUrl,
                    height: 180,
                    fit: BoxFit.cover,
                  ),
                ),
              if (imageUrl != null) const SizedBox(height: 12),
              Text(device['name']?.toString() ?? 'Device',
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 4),
              Text(device['category']?.toString() ?? ''),
              const SizedBox(height: 8),
              Text('Hazard: ${device['hazardLevel'] ?? ''}'),
              Text('Status: ${device['status'] ?? ''}'),
              const SizedBox(height: 8),
              Text(device['classificationResults']?.toString() ?? ''),
              const SizedBox(height: 12),
              if (recommendations.isNotEmpty)
                Text('Recommendations',
                    style: Theme.of(context).textTheme.titleMedium),
              for (final item in recommendations) Text('- ${item.toString()}'),
            ],
          ),
        );
      },
    );
  }
}

class _ResultCard extends StatelessWidget {
  const _ResultCard({
    Key? key,
    required this.device,
    required this.imageUrl,
    required this.onTap,
  }) : super(key: key);

  final Map<String, dynamic> device;
  final String? imageUrl;
  final VoidCallback onTap;

  Color _hazardColor() {
    final hazard = device['hazardLevel']?.toString().toLowerCase() ?? '';
    if (hazard == 'high') {
      return Colors.red.shade400;
    }
    if (hazard == 'medium') {
      return Colors.orange.shade400;
    }
    return Colors.green.shade400;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        onTap: onTap,
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: imageUrl == null
              ? Container(
                  width: 40,
                  height: 40,
                  color: Theme.of(context).colorScheme.surfaceVariant,
                  child: const Icon(Icons.photo_outlined),
                )
              : Image.network(
                  imageUrl!,
                  width: 40,
                  height: 40,
                  fit: BoxFit.cover,
                ),
        ),
        title: Text(device['name']?.toString() ?? 'Device'),
        subtitle: Text(device['category']?.toString() ?? ''),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: _hazardColor().withOpacity(0.15),
            borderRadius: BorderRadius.circular(999),
          ),
          child: Text(
            device['hazardLevel']?.toString() ?? '',
            style: Theme.of(context)
                .textTheme
                .labelSmall
                ?.copyWith(color: _hazardColor()),
          ),
        ),
      ),
    );
  }
}
