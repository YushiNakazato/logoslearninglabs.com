# メール認証用DNSの追加 — 2026-10-29

ユーザーの明示依頼に基づき、`logoslearninglabs.com` にSPFとDMARCのTXTレコードを追加した。対象はお名前.com NaviのDNSレコード設定。既存ネームサーバー `01〜04.dnsv.jp` は維持した。

## 追加内容

| ホスト名 | TYPE | TTL | VALUE |
| --- | --- | ---: | --- |
| 空欄（logoslearninglabs.com） | TXT | 60 | `v=spf1 include:_spf.google.com ~all` |
| _dmarc | TXT | 3600 | `v=DMARC1; p=quarantine` |

ドメイン直下のTTLは既存レコードと同じ60を使用。作業開始時にSPFが未確定の「追加」一覧にあったため、それを利用し、重複追加しなかった。確認画面の「ネームサーバー変更」は「しない」を選び、「設定する」を実行して完了表示を確認した。

## 保存後の照合

2026-10-29 17:31:11 JSTに登録済レコードを読み戻した。変更前12件、変更後14件で、元の12件は入力値・TTL・優先度・有効状態を含めて同一だった。差分は上記TXTの2件のみ。

保持したレコードはNS4件、GitHub PagesのA4件、wwwのCNAME、Google WorkspaceのMX（優先度1、smtp.google.com.）、Google所有確認TXT、google._domainkeyのDKIM公開鍵TXT。既存レコードの変更・削除、ネームサーバーの切替は行っていない。

## DNS照会結果

17:29 JST時点では反映待ちだったが、17:31:40 JSTに両照会先で反映を確認。17:35:43 JSTにも指定の4コマンドで読み戻し、次を確認した。

| 照会先 | SPF件数 | SPF値 | DMARC値 |
| --- | ---: | --- | --- |
| 01.dnsv.jp | 1 | `v=spf1 include:_spf.google.com ~all` | `v=DMARC1; p=quarantine` |
| 8.8.8.8 | 1 | `v=spf1 include:_spf.google.com ~all` | `v=DMARC1; p=quarantine` |

`01.dnsv.jp` はIPv6 `2400:8500:3300::53` に解決された。ドメイン直下のGoogle所有確認TXTも両照会先で保持を確認した。TTLはお名前.comの保存済み設定で確認した値であり、この通常のnslookup出力から取得した値ではない。

```powershell
nslookup -type=TXT logoslearninglabs.com 01.dnsv.jp
nslookup -type=TXT _dmarc.logoslearninglabs.com 01.dnsv.jp
nslookup -type=TXT logoslearninglabs.com 8.8.8.8
nslookup -type=TXT _dmarc.logoslearninglabs.com 8.8.8.8
```

照会時刻・応答値・保存済みレコードの照合結果は [DNS確認記録](2026-10-29-email-authentication-dns.json) に保存した。

## 送信経路の確認と未確認事項

関連リポジトリの読み取り調査では、このドメインについてGoogle Workspace以外の送信サービスやSMTP送信実装は見つからなかった。サイトはAstroの静的サイト。support@に加えてcontact@logoslearninglabs.comのmailto表記もあったが、別の配信サービスの利用を示すものではない。リポジトリ調査だけで外部の全送信元を証明するものではない。

利用可能なGmailにはsupport@logoslearninglabs.comの送信元設定がなく、Google管理コンソールは本人の再認証を要求した。そのためテストメールは送信せず、Authentication-Resultsのspf=pass / dmarc=passおよび管理コンソールのDKIM署名開始状態は未確認。DNSにDKIM公開鍵が存在することを、署名が有効である証拠とは扱っていない。

任意の追加確認には、対象送信元を使用できるGoogleアカウントと管理コンソールへの本人ログインが必要。実メールのdmarc=failは観測していないため、p=noneへの切戻しは行わず、依頼どおりp=quarantineを保持した。

## ソース管理の範囲

この記録とDNS確認JSONだけをソースブランチcodex/learning-labs-redesignに保存する。サイトのソース・生成物・公開用mainは変更せず、Webサイトのデプロイは行わない。親リポジトリではlogos-learning-labsのgitlinkのみを更新する。別作業のcorporate/name-change-2026-10/11_cert_reissue_20261029/は変更・ステージ対象外。
