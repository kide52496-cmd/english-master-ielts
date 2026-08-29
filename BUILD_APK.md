# Tạo file APK cho English Master IELTS

App đã được cấu hình sẵn với **Capacitor** để đóng gói thành APK Android.
Tài liệu này hướng dẫn build ra file `.apk` cài vào điện thoại.

---

## 1. Cài đặt một lần (bắt buộc)

Build APK cần 2 thứ. Chỉ cài 1 lần, dùng mãi.

### a) Java JDK 17
- Tải: https://adoptium.net (chọn **Temurin 17 (LTS)**, Windows x64 `.msi`)
- Cài đặt, tích chọn **"Set JAVA_HOME"** trong lúc cài.
- Kiểm tra: mở PowerShell mới, gõ `java -version` → phải hiện `17.x`.

### b) Android SDK (qua Android Studio)
- Tải Android Studio: https://developer.android.com/studio
- Cài đặt với tùy chọn mặc định. Lần đầu mở, nó tự tải **Android SDK** (~vài GB).
- SDK thường nằm ở: `C:\Users\<tên>\AppData\Local\Android\Sdk`

> Nếu không muốn cài cả Android Studio: cài riêng "Command line tools" rồi dùng `sdkmanager` để tải `platform-tools`, `platforms;android-35`, `build-tools`. Nhưng cài Android Studio là dễ nhất.

---

## 2. Trỏ project tới Android SDK

Tạo file `android/local.properties` (cùng cấp với `gradlew.bat`) với nội dung:

```
sdk.dir=C:\\Users\\<tên>\\AppData\\Local\\Android\\Sdk
```

> Thay `<tên>` bằng tên user Windows của bạn. Dùng dấu `\\` (gạch chéo đôi).
> Trên máy này: `sdk.dir=C:\\Users\\duong\\AppData\\Local\\Android\\Sdk`

---

## 3. Build APK

Mở PowerShell tại thư mục project (`D:\english-master-ielts`) rồi chạy:

```powershell
npm run android:apk
```

Lệnh này tự động: build web → sync vào Android → build APK debug.

File APK xuất ra tại:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

Copy file đó vào điện thoại, mở lên cài (cần bật **"Cài đặt từ nguồn không xác định"** trong Settings điện thoại).

> Lần build đầu Gradle tải dependency, có thể mất 5–10 phút. Các lần sau nhanh hơn nhiều.

---

## 4. Mở project trong Android Studio (tùy chọn)

Nếu muốn build bằng giao diện, hoặc tạo bản release đã ký:

```powershell
npm run android:open
```

Trong Android Studio: menu **Build → Build Bundle(s)/APK(s) → Build APK(s)**.

---

## 5. Các lệnh có sẵn

| Lệnh | Việc |
|---|---|
| `npm run build` | Build web (ra thư mục `dist`) |
| `npm run android:sync` | Build web + đồng bộ vào project Android |
| `npm run android:open` | Sync + mở Android Studio |
| `npm run android:apk` | Build ra **APK debug** (cài thử) |
| `npm run android:apk-release` | Build APK release (cần ký số mới cài được) |
| `npm run icons` | Sinh lại toàn bộ icon từ SVG |

---

## 6. Khi sửa nội dung app

Mỗi lần thay đổi code/dữ liệu, chạy lại:
```powershell
npm run android:apk
```
rồi cài lại APK mới. (Hoặc `npm run android:sync` rồi build trong Android Studio.)

---

## Thông tin app

- **App ID**: `com.nguyenanduong.englishmasterielts`
- **Tên**: English Master IELTS
- **Phiên bản**: chỉnh `versionCode` / `versionName` trong `android/app/build.gradle`
- Chạy **100% offline** — toàn bộ nội dung được đóng gói trong APK, không cần internet.

---

## Lưu ý về APK debug vs release

- **APK debug** (`android:apk`): cài và dùng được ngay trên điện thoại của bạn. Phù hợp để tự dùng và chia sẻ cho bạn bè cài tay.
- **APK release**: nhẹ hơn, tối ưu hơn, nhưng **phải ký số (keystore)** mới cài được, và bắt buộc nếu sau này muốn đăng lên CH Play. Khi cần làm bản release/ký số, cho tôi biết để hướng dẫn tạo keystore.
