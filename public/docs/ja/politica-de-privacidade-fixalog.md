# プライバシーポリシー - Fixalog

**Fixalog** アプリケーションは、クライミングルートの支点に関する安全性、文書化、および技術監査のために Aresta Climb エコシステムによって開発されました。

本ポリシーでは、使用する権限、データのローカル保存方法、および情報の保護方法について明確に説明します。

---

## 1. ローカル保存の原則とデータ主権（オフラインファースト）

Fixalog は厳密な **オフラインファースト（Offline-First）** アーキテクチャで構築されています：
- 技術者ID情報（氏名、公開メールアドレス、公開鍵、証明書）および作成中のすべてのレポートは、お使いの端末の **ローカルデータベース（SQLite）のみ** に保存されます。
- ユーザーが明示的に共有またはエクスポート操作を行わない限り、写真、動画、GPS座標が外部サーバーへ自動送信されることはありません。

---

## 2. 要求する端末権限

### A. カメラ
- **目的：** 固定支点（ボルト、ハンガー、終了点、腐食状態）の詳細な写真・動画の撮影。
- **使用：** メディアはローカルセッションフォルダに保存され、電子署名された EPUB 3 および PDF レポートに埋め込まれます。

### B. 正確な位置情報（GPS）
- **目的：** 点検時点における地理座標の記録。
- **使用：** 技術レポートが岩場での正確な作業位置を証明できるようにします。

---

## 3. 暗号化と電子署名

Fixalog が生成する技術レポートは、端末内のローカル暗号鍵を使用して電子署名（X.509 XML-DSig）されます。署名用の秘密鍵は端末のセキュアストレージ（Secure Storage / Keystore）内で保護され、外部サーバーに送信されることは一切ありません。

---

## 4. 診断データとクラッシュ監視（Crashlytics および Sentry）

アプリの継続的な安定性を確保するため、Fixalog は **Firebase Crashlytics** および **Sentry** を通じて匿名のクラッシュレポートを収集します。支点の写真、GPS座標、または秘密鍵がエラーレポートに含まれることはありません。

---

## 5. 第三者サービス

- [Apple](https://www.apple.com/legal/privacy/)
- [Google Play Services](https://policies.google.com/privacy)
- [Firebase](https://firebase.google.com/support/privacy)
- [Sentry](https://sentry.io/privacy/)
- [GitHub](https://docs.github.com/ja/site-policy/privacy-policies/github-general-privacy-statement)
- [Supabase](https://supabase.com/privacy)

---

## 6. ユーザーの権利

データはユーザー自身の端末内で直接管理されるため、設定画面からのID情報の変更・削除、ローカルレポート履歴の削除、およびOS設定からのカメラ・位置情報権限の取り消しをいつでも行うことができます。

---

## 7. お問い合わせと発効日

本ポリシーに関するご質問は、[arestaclimb.com](https://arestaclimb.com) または **contato@arestaclimb.com** までお問い合わせください。本ポリシーは 2026年10月25日 より発効します。
