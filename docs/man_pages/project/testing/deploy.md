deploy
==========

Usage | Synopsis
---|---
Deploy on Android | `$ tns deploy android [--device <Device ID>] [--keyStorePath <File Path> --keyStorePassword <Password> --keyStoreAlias <Name> --keyStoreAliasPassword <Password>] [--release]`
<% if(isMacOS) { %>Deploy on iOS | `$ tns deploy ios [--device <Device ID>] [--release]`<% } %> 

Builds and deploys the project to a connected physical or virtual device. <% if(isMacOS) { %>You must specify the target platform on which you want to deploy.<% } %>

<% if(isMacOS) { %>
<% if(isHtml) { %>> <% } %>IMPORTANT: Before building for iOS device, verify that you have configured a valid pair of certificate and provisioning profile on your OS X system. <% if(isHtml) { %>For more information, see [Obtaining Signing Identities and Downloading Provisioning Profiles](https://developer.apple.com/library/mac/recipes/xcode_help-accounts_preferences/articles/obtain_certificates_and_provisioning_profiles.html).<% } %>

### Options for iOS
* `--device` - Deploys the project on the specified connected physical or virtual device.
* `--release` - If set, produces a release build. Otherwise, produces a debug build.<% } %> 

### Options<% if(isMacOS) { %> for Android<% } %>
* `--device` - Deploys the project on the specified connected physical or virtual device.
* `--release` - If set, produces a release build. Otherwise, produces a debug build. When the `--keyStore*` options are specified, produces a signed release build.
* `--keyStorePath` - Specifies the file path to the keystore file (P12) which you want to use to code sign your APK. You can use the `--keyStore*` options along with `--release` to produce a signed release build. You need to specify all `--keyStore*` options.
* `--keyStorePassword` - Provides the password for the keystore file specified with `--keyStorePath`. You can use the `--keyStore*` options along with `--release` to produce a signed release build. You need to specify all `--keyStore*` options.
* `--keyStoreAlias` - Provides the alias for the keystore file specified with `--keyStorePath`. You can use the `--keyStore*` options along with `--release` to produce a signed release build. You need to specify all `--keyStore*` options.
* `--keyStoreAliasPassword` - Provides the password for the alias specified with `--keStoreAliasPassword`. You can use the `--keyStore*` options along with `--release` to produce a signed release build. You need to specify all `--keyStore*` options.

### Attributes
* `<Device ID>` is the index or name of the target device as listed by `$ tns device`

<% if(isHtml) { %> 
### Command Limitations

* You can run `$ tns deploy ios` only on OS X systems.

### Related Commands

Command | Description
----------|----------
[build android](build-android.html) | Builds the project for Android and produces an APK that you can manually deploy on device or in the native emulator.
[build ios](build-ios.html) | Builds the project for iOS and produces an APP or IPA that you can manually deploy in the iOS Simulator or on device, respectively.
[build](build.html) | Builds the project for the selected target platform and produces an application package that you can manually deploy on device or in the native emulator.
[debug android](debug-android.html) | Debugs your project on a connected Android device or in a native emulator.
[debug ios](debug-ios.html) | Debugs your project on a connected iOS device or in a native emulator.
[debug](debug.html) | Debugs your project on a connected device or in a native emulator.
[emulate android](emulate-android.html) | Builds the specified project and runs it in a native Android emulator.
[emulate ios](emulate-ios.html) | Builds the specified project and runs it in the native iOS Simulator.
[emulate](emulate.html) | You must run the emulate command with a related command.
[run android](run-android.html) | Runs your project on a connected Android device or in a native Android emulator, if configured.
[run ios](run-ios.html) | Runs your project on a connected iOS device or in the iOS Simulator, if configured.
[run](run.html) | Runs your project on a connected device or in the native emulator for the selected platform.
<% } %>