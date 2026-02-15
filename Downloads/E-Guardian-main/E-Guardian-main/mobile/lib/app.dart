import 'package:flutter/material.dart';

import 'screens/login_screen.dart';
import 'screens/main_shell.dart';
import 'state/session_controller.dart';
import 'theme/app_theme.dart';

class AppRoot extends StatefulWidget {
  const AppRoot({Key? key}) : super(key: key);

  @override
  State<AppRoot> createState() => _AppRootState();
}

class _AppRootState extends State<AppRoot> {
  final SessionController _session = SessionController();
  late final Future<void> _initFuture;

  @override
  void initState() {
    super.initState();
    _initFuture = _session.init();
  }

  @override
  Widget build(BuildContext context) {
    return AppScope(
      controller: _session,
      child: AnimatedBuilder(
        animation: _session,
        builder: (context, _) {
          return MaterialApp(
            title: 'E-Guardian',
            theme: AppTheme.lightTheme,
            home: FutureBuilder<void>(
              future: _initFuture,
              builder: (context, snapshot) {
                if (_session.isLoading) {
                  return const SplashScreen();
                }
                return _session.isAuthenticated
                    ? const MainShell()
                    : const LoginScreen();
              },
            ),
          );
        },
      ),
    );
  }
}

class AppScope extends InheritedNotifier<SessionController> {
  const AppScope({
    Key? key,
    required SessionController controller,
    required Widget child,
  }) : super(key: key, notifier: controller, child: child);

  static SessionController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppScope>();
    if (scope == null) {
      throw StateError('AppScope not found in context');
    }
    return scope.notifier!;
  }
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
