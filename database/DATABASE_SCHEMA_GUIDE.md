# Tài liệu Cấu trúc Database BKBank

## Mục lục
1. [Chi nhánh (Branches)](#branches)
2. [Khách hàng (Customers)](#customers)
3. [Tài khoản (Accounts)](#accounts)
4. [Thẻ (Cards)](#cards)
5. [Thương nhân (Merchants)](#merchants)
6. [Giao dịch (Transactions)](#transactions)
7. [Giao dịch tài khoản (Account Transactions)](#account_transactions)
8. [Sổ cái (Ledger Entries)](#ledger_entries)
9. [Hoá đơn thẻ tín dụng (Credit Card Bills)](#credit_card_bills)
10. [Thanh toán thẻ tín dụng (Credit Card Payments)](#credit_card_payments)

---

## CHI NHÁNH (BRANCHES)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `branch_id` | BIGINT (Khóa chính) | Mã định danh duy nhất cho chi nhánh, tự động tăng |
| `name` | VARCHAR(120) | Tên của chi nhánh ngân hàng |

**Mục đích**: Lưu trữ thông tin về các chi nhánh ngân hàng.

**Ví dụ**: Chi nhánh Hà Nội, Chi nhánh TP.HCM, Chi nhánh Đà Nẵng.

---

## KHÁCH HÀNG (CUSTOMERS)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `citizen_id` | VARCHAR(32) (Khóa chính) | Số CMND/CCCD quốc gia, định danh duy nhất |
| `first_name` | VARCHAR(80) | Tên của khách hàng |
| `last_name` | VARCHAR(80) | Họ của khách hàng |
| `phone` | VARCHAR(30) | Số điện thoại khách hàng (được lập chỉ mục để tìm kiếm nhanh) |
| `date_of_birth` | DATE | Ngày sinh của khách hàng |
| `gender` | ENUM('M', 'F', 'O') | Giới tính (Nam, Nữ, Khác) |
| `job` | VARCHAR(120) | Nghề nghiệp / Công việc |
| `home_country` | VARCHAR(2) | Mã quốc gia (mặc định: 'VN' cho Việt Nam) |
| `latitude` | DECIMAL(10, 7) | Tọa độ vĩ độ của khách hàng |
| `longitude` | DECIMAL(10, 7) | Tọa độ kinh độ của khách hàng |
| `created_at` | TIMESTAMP | Thời gian tạo bản ghi |

**Chỉ mục**:
- `idx_customer_phone`: Để tìm kiếm nhanh theo số điện thoại

**Mục đích**: Lưu trữ thông tin hồ sơ và dữ liệu cá nhân của khách hàng.

---

## TÀI KHOẢN (ACCOUNTS)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `account_number` | VARCHAR(32) (Khóa chính) | Mã tài khoản duy nhất |
| `balance` | DECIMAL(18, 2) | Số dư có sẵn hiện tại |
| `hold_balance` | DECIMAL(18, 2) | Số tiền bị giữ (cho các giao dịch chuyển tiền đang chờ/saga pattern) |
| `currency` | VARCHAR(3) | Mã loại tiền (mặc định: 'VND') |
| `status` | ENUM('ACTIVE', 'BLOCKED') | Trạng thái tài khoản (Hoạt động, Bị khóa) |
| `customer_id` | VARCHAR(32) (Khóa ngoài) | Tham chiếu đến khách hàng |
| `branch_id` | BIGINT (Khóa ngoài) | Tham chiếu đến chi nhánh |
| `created_at` | TIMESTAMP | Thời gian tạo tài khoản |

**Chỉ mục**:
- `idx_account_customer`: Để tìm tài khoản theo khách hàng
- `idx_account_branch`: Để tìm tài khoản theo chi nhánh

**Khóa ngoài**:
- `fk_accounts_customer`: Liên kết tới bảng customers
- `fk_accounts_branch`: Liên kết tới bảng branches

**Mục đích**: Lưu trữ tài khoản ngân hàng và thông tin số dư của khách hàng.

**Ví dụ**: Một khách hàng có thể có nhiều tài khoản (tiết kiệm, thanh toán, v.v.)

---

## THẺ (CARDS)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `card_id` | VARCHAR(36) (Khóa chính) | Mã định danh duy nhất của thẻ (UUID) |
| `pan_token` | VARCHAR(128) | Mã thẻ được mã hóa/băm để bảo mật |
| `last4` | VARCHAR(4) | 4 chữ số cuối cùng của số thẻ |
| `exp_month` | INT | Tháng hết hạn (1-12) |
| `exp_year` | INT | Năm hết hạn |
| `status` | ENUM('ACTIVE', 'BLOCKED') | Trạng thái thẻ (Hoạt động, Bị khóa) |
| `card_type` | VARCHAR(40) | Thương hiệu thẻ (Visa, Mastercard, v.v.) |
| `credit_limit` | DECIMAL(18, 2) | Hạn mức tín dụng cho thẻ tín dụng |
| `available_credit` | DECIMAL(18, 2) | Hạn mức tín dụng còn lại |
| `current_balance` | DECIMAL(18, 2) | Số dư hiện tại trên thẻ |
| `account_id` | VARCHAR(32) (Khóa ngoài) | Tham chiếu đến tài khoản |
| `created_at` | TIMESTAMP | Thời gian tạo thẻ |

**Chỉ mục**:
- `idx_card_account`: Để tìm thẻ theo tài khoản

**Khóa ngoài**:
- `fk_cards_account`: Liên kết tới bảng accounts

**Mục đích**: Lưu trữ thông tin thẻ ghi nợ và thẻ tín dụng được liên kết với tài khoản.

**Lưu ý**: Thẻ ghi nợ không có hạn mức tín dụng, thẻ tín dụng có hạn mức.

---

## THƯƠNG NHÂN (MERCHANTS)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `merchant_id` | VARCHAR(64) (Khóa chính) | Mã định danh duy nhất của thương nhân |
| `merchant_name` | VARCHAR(160) | Tên của cửa hàng / thương nhân |
| `category` | VARCHAR(60) | Loại hình kinh doanh (ví dụ: Bán lẻ, Xăng dầu, v.v.) |
| `country` | VARCHAR(2) | Mã quốc gia nơi thương nhân hoạt động |
| `city_population` | INT | Dân số của thành phố có thương nhân |
| `city` | VARCHAR(120) | Tên thành phố |
| `street` | VARCHAR(160) | Địa chỉ đường phố |
| `state` | VARCHAR(60) | Tỉnh / Thành phố |
| `zip` | VARCHAR(20) | Mã bưu điện |
| `merch_long` | DECIMAL(10, 7) | Kinh độ của thương nhân để phát hiện gian lận dựa trên vị trí |
| `merch_lat` | DECIMAL(10, 7) | Vĩ độ của thương nhân để phát hiện gian lận dựa trên vị trí |
| `created_at` | TIMESTAMP | Thời gian tạo bản ghi |

**Chỉ mục**:
- `idx_merchant_country_category`: Để tìm kiếm nhanh thương nhân theo vị trí và loại hình

**Mục đích**: Lưu trữ thông tin cửa hàng / thương nhân cho các giao dịch thanh toán bằng thẻ.

---

## GIAO DỊCH (TRANSACTIONS)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `transaction_id` | VARCHAR(36) (Khóa chính) | Mã định danh duy nhất của giao dịch (UUID) |
| `idempotency_key` | VARCHAR(80) | Khóa duy nhất để ngăn chặn giao dịch trùng lặp |
| `channel` | ENUM('CARD_PAYMENT', 'TRANSFER') | Loại giao dịch (Thanh toán thẻ, Chuyển tiền) |
| `status` | ENUM('PENDING', 'APPROVED', 'DECLINED', 'SUCCESS', 'FAILED', 'REFUNDED') | Trạng thái hiện tại của giao dịch |
| `amount` | DECIMAL(18, 2) | Số tiền giao dịch |
| `trans_date` | DATE | Ngày giao dịch |
| `trans_time` | TIMESTAMP | Thời gian giao dịch |
| `unix_time` | BIGINT | Unix timestamp của giao dịch |
| `trans_num` | VARCHAR(64) | Số tham chiếu giao dịch |
| `merchant_id` | VARCHAR(64) (Khóa ngoài) | Tham chiếu đến thương nhân (cho thanh toán thẻ) |
| `card_id` | VARCHAR(36) (Khóa ngoài) | Tham chiếu đến thẻ được sử dụng (cho thanh toán thẻ) |
| `risk_score` | DOUBLE | Điểm rủi ro phát hiện gian lận (0.0 - 1.0) |
| `fraud_decision` | ENUM('PASS', 'REJECT', 'REVIEW') | Quyết định phát hiện gian lận |
| `model_version` | VARCHAR(40) | Phiên bản mô hình phát hiện gian lận được sử dụng |
| `reason_code` | VARCHAR(80) | Lý do quyết định gian lận |
| `card_type` | ENUM('DEBIT', 'CREDIT') | Loại thẻ được sử dụng (Ghi nợ hoặc Tín dụng) |
| `is_credited_payment` | BOOLEAN | Liệu đây có phải là thanh toán hoá đơn thẻ tín dụng |
| `created_at` | TIMESTAMP | Thời gian tạo bản ghi |

**Chỉ mục**:
- `idx_tx_channel_time`: Để truy vấn giao dịch theo kênh và thời gian
- `idx_tx_card_time`: Để truy vấn giao dịch theo thẻ và thời gian
- `idx_tx_merchant_time`: Để truy vấn giao dịch theo thương nhân và thời gian

**Khóa ngoài**:
- `fk_transactions_merchant`: Liên kết tới bảng merchants
- `fk_transactions_card`: Liên kết tới bảng cards

**Mục đích**: Lưu trữ tất cả các bản ghi giao dịch với phát hiện gian lận và theo dõi trạng thái.

---

## GIAO DỊCH TÀI KHOẢN (ACCOUNT_TRANSACTIONS)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `id` | BIGINT (Khóa chính) | Khóa chính tự động tăng |
| `transaction_id` | VARCHAR(36) (Khóa ngoài, UNIQUE) | Tham chiếu đến giao dịch |
| `account_number_send` | VARCHAR(32) (Khóa ngoài) | Số tài khoản của người gửi |
| `account_number_receive` | VARCHAR(32) (Khóa ngoài, nullable) | Số tài khoản của người nhận (NULL cho chuyển tiền liên ngân hàng) |
| `to_bank_id` | VARCHAR(20) | Mã ngân hàng nhận (cho chuyển tiền liên ngân hàng) |
| `to_account_no_external` | VARCHAR(32) | Số tài khoản bên ngoài (cho chuyển tiền liên ngân hàng) |
| `created_at` | TIMESTAMP | Thời gian tạo bản ghi |

**Chỉ mục**:
- `idx_acctrans_send`: Để tìm giao dịch theo tài khoản gửi
- `idx_acctrans_receive`: Để tìm giao dịch theo tài khoản nhận

**Khóa ngoài**:
- `fk_account_trans_tx`: Liên kết tới bảng transactions
- `fk_account_trans_send`: Liên kết tới bảng accounts (người gửi)
- `fk_account_trans_receive`: Liên kết tới bảng accounts (người nhận)

**Mục đích**: Ánh xạ giao dịch tới tài khoản người gửi và người nhận. Hỗ trợ:
- Chuyển tiền nội bộ (cả hai tài khoản trong DB)
- Thanh toán thẻ (người nhận NULL hoặc tài khoản thương nhân)
- Chuyển tiền liên ngân hàng (người nhận NULL, sử dụng to_bank_id + to_account_no_external)

---

## SỔ CÁI (LEDGER_ENTRIES)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `entry_id` | VARCHAR(36) (Khóa chính) | Mã định danh duy nhất của mục sổ cái (UUID) |
| `account_id` | VARCHAR(32) (Khóa ngoài) | Tham chiếu đến tài khoản |
| `ref_type` | ENUM('CARD_TX', 'TRANSFER') | Loại giao dịch mục sổ cái liên quan đến |
| `ref_id` | VARCHAR(36) | Mã tham chiếu (transaction_id hoặc transfer_id) |
| `entry_type` | ENUM('HOLD', 'RELEASE_HOLD', 'DEBIT', 'CREDIT') | Loại mục sổ cái |
| `amount` | DECIMAL(18, 2) | Số tiền cho mục này |
| `created_at` | TIMESTAMP | Thời gian tạo mục |

**Chỉ mục**:
- `idx_ledger_account_time`: Để truy vấn các mục sổ cái theo tài khoản và thời gian
- `idx_ledger_ref`: Để truy vấn các mục sổ cái theo tham chiếu

**Khóa ngoài**:
- `fk_ledger_entries_account`: Liên kết tới bảng accounts

**Mục đích**: Dấu vết kiểm tra cho tất cả các thay đổi số dư tài khoản. Theo dõi giữ, phát hành, ghi nợ và ghi có để đối chiếu.

**Loại mục**:
- `HOLD`: Số tiền bị giữ cho giao dịch đang chờ
- `RELEASE_HOLD`: Giữ được phát hành (giao dịch bị từ chối)
- `DEBIT`: Tiền bị trừ từ tài khoản
- `CREDIT`: Tiền được cộng vào tài khoản

---

## HOÁ ĐƠN THẺ TÍN DỤNG (CREDIT_CARD_BILLS)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `bill_id` | VARCHAR(36) (Khóa chính) | Mã định danh duy nhất của hoá đơn (UUID) |
| `card_id` | VARCHAR(36) (Khóa ngoài) | Tham chiếu đến thẻ tín dụng |
| `billing_period_start` | DATE | Ngày bắt đầu kỳ tính tiền |
| `billing_period_end` | DATE | Ngày kết thúc kỳ tính tiền |
| `due_date` | DATE | Ngày hạn thanh toán |
| `total_amount` | DECIMAL(18, 2) | Tổng số tiền phải thanh toán |
| `minimum_payment` | DECIMAL(18, 2) | Số tiền thanh toán tối thiểu bắt buộc |
| `paid_amount` | DECIMAL(18, 2) | Số tiền đã được thanh toán |
| `status` | ENUM('PENDING', 'PAID', 'OVERDUE') | Trạng thái hoá đơn (Chờ xử lý, Đã thanh toán, Quá hạn) |
| `created_at` | TIMESTAMP | Thời gian tạo hoá đơn |
| `updated_at` | TIMESTAMP | Thời gian cập nhật lần cuối |

**Chỉ mục**:
- `idx_bill_card`: Để tìm hoá đơn theo thẻ
- `idx_bill_status`: Để truy vấn hoá đơn theo trạng thái
- `idx_bill_due_date`: Để tìm hoá đơn quá hạn

**Khóa ngoài**:
- `fk_bill_card`: Liên kết tới bảng cards

**Mục đích**: Lưu trữ các kỳ tính tiền thẻ tín dụng và theo dõi thanh toán.

---

## THANH TOÁN THẺ TÍN DỤNG (CREDIT_CARD_PAYMENTS)

| Trường | Kiểu dữ liệu | Mô tả |
|--------|------|-------------|
| `payment_id` | VARCHAR(36) (Khóa chính) | Mã định danh duy nhất của thanh toán (UUID) |
| `bill_id` | VARCHAR(36) (Khóa ngoài) | Tham chiếu đến hoá đơn được thanh toán |
| `transaction_id` | VARCHAR(36) (Khóa ngoài, nullable) | Tham chiếu đến giao dịch thanh toán |
| `amount` | DECIMAL(18, 2) | Số tiền thanh toán |
| `payment_date` | TIMESTAMP | Thời gian thanh toán |
| `status` | ENUM('SUCCESS', 'FAILED', 'PENDING') | Trạng thái thanh toán (Thành công, Thất bại, Chờ xử lý) |
| `description` | VARCHAR(255) | Mô tả / Ghi chú thanh toán |
| `created_at` | TIMESTAMP | Thời gian tạo bản ghi |

**Chỉ mục**:
- `idx_payment_bill`: Để tìm thanh toán theo hoá đơn
- `idx_payment_status`: Để truy vấn thanh toán theo trạng thái
- `idx_payment_transaction`: Để tìm thanh toán theo giao dịch

**Khóa ngoài**:
- `fk_payment_bill`: Liên kết tới bảng credit_card_bills
- `fk_payment_transaction`: Liên kết tới bảng transactions

**Mục đích**: Theo dõi các khoản thanh toán riêng lẻ được thực hiện cho hoá đơn thẻ tín dụng.

---

## QUAN HỆ DỮ LIỆU

### Luồng Thanh toán Thẻ
```
Khách hàng → Tài khoản → Thẻ → Giao dịch → Thương nhân
                              ↓
                    Giao dịch tài khoản (liên kết người gửi/người nhận)
                              ↓
                        Sổ cái (dấu vết kiểm tra)
```

### Luồng Thẻ Tín dụng
```
Thẻ (Tín dụng) → Hoá đơn → Thanh toán → Giao dịch
```

---

## CÁC MẪU THIẾT KẾ CHÍNH

### 1. **Mẫu Saga cho Chuyển Tiền**
- `hold_balance` trong tài khoản: Giữ số tiền trong lúc chuyển tiền đang chờ
- Các mục sổ cái theo dõi: HOLD → DEBIT/CREDIT hoặc RELEASE_HOLD

**Lợi ích**: Đảm bảo tính nhất quán của dữ liệu và phục hồi được trường hợp lỗi

### 2. **Phát hiện Gian lận**
- `risk_score`, `fraud_decision`, `model_version` trong giao dịch
- Phát hiện dựa trên vị trí bằng cách sử dụng tọa độ khách hàng và thương nhân

**Lợi ích**: Bảo vệ khách hàng khỏi giao dịch gian lận

### 3. **Tính Lũy**
- `idempotency_key` ngăn chặn giao dịch trùng lặp
- Đảm bảo việc thử lại yêu cầu thất bại một cách an toàn

**Lợi ích**: Hệ thống đáng tin cậy khi mạng không ổn định

### 4. **Hỗ trợ Liên ngân hàng**
- `account_transactions` hỗ trợ cả chuyển tiền nội bộ và bên ngoài
- Chuyển tiền bên ngoài sử dụng `to_bank_id` + `to_account_no_external`

**Lợi ích**: Tích hợp với các ngân hàng khác

### 5. **Hỗ trợ Loại Thẻ**
- Bảng thẻ thống nhất cho cả thẻ ghi nợ và tín dụng
- Thẻ tín dụng có `credit_limit`, `available_credit`, `current_balance`
- Hoá đơn thẻ và thanh toán theo dõi các kỳ tín dụng

**Lợi ích**: Linh hoạt trong việc hỗ trợ nhiều loại thẻ

---

## RÀNG BUỘC VÀ XÁC THỰC

- Tất cả các quan hệ khóa ngoài sử dụng `ON UPDATE CASCADE` và `ON DELETE RESTRICT`
- Giao dịch thẻ xóa theo tầng tới các mục sổ cái
- Số tiền được lưu trữ dưới dạng DECIMAL(18, 2) để chính xác tài chính
- Tất cả các thời gian dấu tạo sử dụng UTC (+00:00)
- Ký tự UTF8MB4 để hỗ trợ ký tự quốc tế

**Ghi chú**: Không được để số âm trong `balance`, `amount`, và các trường tài chính khác trừ khi được phép.
