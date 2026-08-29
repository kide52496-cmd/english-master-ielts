# Tao ban iOS cho English Master IELTS

Project da duoc cau hinh san voi **Capacitor iOS** de dong goi thanh app iPhone.

> Luu y quan trong: Windows tao va sync duoc project iOS, nhung khong build/ky duoc file cai dat cho iPhone. Apple bat buoc dung **macOS + Xcode** cho buoc chay tren iPhone, tao `.ipa`, TestFlight, hoac App Store.

---

## 1. Da co san trong project

- App ID: `com.nguyenanduong.englishmasterielts`
- Ten app: `English Master IELTS`
- Thu muc iOS: `ios/`
- Xcode project: `ios/App/App.xcodeproj`
- Web build duoc dong goi tu: `dist/`
- Plugin iOS da sync: `@capacitor-community/text-to-speech`

---

## 2. Lenh iOS co san

Chay trong thu muc project:

```powershell
npm run ios:sync
```

Lenh nay build web bang Vite roi sync vao thu muc `ios/`.

Neu dang o may Mac, co the mo Xcode bang:

```bash
npm run ios:open
```

---

## 3. Cai len iPhone bang Xcode

Tren may Mac:

1. Cai Node.js va Xcode.
2. Copy project nay sang Mac.
3. Mo Terminal tai thu muc project.
4. Cai dependency:

```bash
npm install
```

5. Sync iOS:

```bash
npm run ios:sync
```

6. Mo project trong Xcode:

```bash
npm run ios:open
```

Hoac mo file:

```text
ios/App/App.xcodeproj
```

7. Trong Xcode:
   - Chon target **App**.
   - Mo tab **Signing & Capabilities**.
   - Chon Apple account/team cua ban.
   - Cam iPhone vao Mac bang cap.
   - Chon thiet bi iPhone o thanh device.
   - Bam **Run**.

Neu iPhone hoi tin cay may tinh, bam **Trust**. Neu iOS chan app developer, vao:

```text
Settings > General > VPN & Device Management
```

Sau do trust developer account cua ban.

---

## 4. Tao file IPA / TestFlight / App Store

Tren Xcode:

1. Chon **Any iOS Device** hoac thiet bi that.
2. Vao menu **Product > Archive**.
3. Sau khi archive xong, Xcode mo Organizer.
4. Chon:
   - **Distribute App** de xuat `.ipa`, hoac
   - **App Store Connect** de day len TestFlight/App Store.

De phat hanh qua TestFlight/App Store, can Apple Developer Program tra phi.

---

## 5. Moi lan sua noi dung app

Moi lan sua code React/data bai hoc, chay lai:

```bash
npm run ios:sync
```

Sau do mo lai Xcode va bam **Run** hoac archive lai.

---

## 6. Ghi chu

- Khong can viet lai app bang Swift.
- Ban Android/APK hien co khong bi thay doi.
- Thu muc `ios/` la ban native wrapper cho iPhone.
- Neu chi muon dung noi bo tren iPhone cua minh, Xcode Run la du.
- Neu muon gui cho nhieu nguoi cai de dang, nen dung TestFlight.
