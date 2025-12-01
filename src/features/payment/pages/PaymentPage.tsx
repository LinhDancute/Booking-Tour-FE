"use client"

import type React from "react"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../../../components/common/Button"
import Input from "../../../components/common/Input"
import { usePayment } from "../hooks/usePayment"
import { formatCurrency } from "../../../utils/formatCurrency"
import { PAYMENT_STATUS } from "../../../utils/constants"
import "./PaymentPage.scss"

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { createPayment, confirmPayment, loading, error } = usePayment()

  console.log(location.state)
  const bookingId = (location.state as any)?.bookingId || ""
  const total = (location.state as any)?.total || 0

  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [formError, setFormError] = useState<Record<string, string>>({})
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const validateCardForm = () => {
    const errors: Record<string, string> = {}
    if (!cardData.cardNumber) errors.cardNumber = "Số thẻ là bắt buộc"
    if (!cardData.cardHolder) errors.cardHolder = "Tên chủ thẻ là bắt buộc"
    if (!cardData.expiryDate) errors.expiryDate = "Ngày hết hạn là bắt buộc"
    if (!cardData.cvv) errors.cvv = "CVV là bắt buộc"

    if (cardData.cardNumber && cardData.cardNumber.replace(/\s/g, "").length !== 16) {
      errors.cardNumber = "Số thẻ phải có 16 chữ số"
    }
    if (cardData.cvv && cardData.cvv.length !== 3) {
      errors.cvv = "CVV phải có 3 chữ số"
    }

    return errors
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "")
    if (value.length <= 16) {
      value = value.replace(/(\d{4})/g, "$1 ").trim()
      setCardData({ ...cardData, cardNumber: value })
      setFormError({ ...formError, cardNumber: "" })
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2)
      }
      setCardData({ ...cardData, expiryDate: value })
      setFormError({ ...formError, expiryDate: "" })
    }
  }

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 3) {
      setCardData({ ...cardData, cvv: value })
      setFormError({ ...formError, cvv: "" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "credit_card") {
      const errors = validateCardForm()
      if (Object.keys(errors).length > 0) {
        setFormError(errors)
        return
      }
    }

    // Create payment
    const paymentResult = await createPayment(bookingId, total)
    if (paymentResult.success) {
      setTransactionId(paymentResult.payment.id)
      setPaymentStatus(PAYMENT_STATUS.COMPLETED)

      // Simulate payment confirmation
      setTimeout(() => {
        navigate("/bookings", {
          state: { message: "Thanh toán thành công!" },
        })
      }, 2000)
    }
  }

  if (paymentStatus === PAYMENT_STATUS.COMPLETED) {
    return (
      <div className="payment-success">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>Thanh Toán Thành Công!</h1>
          <p>Mã giao dịch: {transactionId}</p>
          <p>Số tiền: {formatCurrency(total)}</p>
          <p className="message">Chúng tôi sẽ gửi xác nhận qua email của bạn</p>
          <Button onClick={() => navigate("/bookings")}>Quay Lại Bookings</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-form-section">
          <h1>Thanh Toán</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="payment-form">
            <div className="payment-method-selector">
              <h2>Chọn Phương Thức Thanh Toán</h2>
              <div className="method-options">
                <label className={`method-option ${paymentMethod === "credit_card" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-icon">💳</span>
                  <span className="method-name">Thẻ Tín Dụng</span>
                </label>

                <label className={`method-option ${paymentMethod === "bank_transfer" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-icon">🏦</span>
                  <span className="method-name">Chuyển Khoản Ngân Hàng</span>
                </label>

                <label className={`method-option ${paymentMethod === "wallet" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-icon">👛</span>
                  <span className="method-name">Ví Điện Tử</span>
                </label>
              </div>
            </div>

            {paymentMethod === "credit_card" && (
              <div className="card-form">
                <h2>Thông Tin Thẻ</h2>

                <Input
                  label="Số Thẻ"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={handleCardNumberChange}
                  error={formError.cardNumber}
                  maxLength={19}
                />

                <Input
                  label="Tên Chủ Thẻ"
                  placeholder="Nhập tên trên thẻ"
                  value={cardData.cardHolder}
                  onChange={(e) => {
                    setCardData({ ...cardData, cardHolder: e.target.value })
                    setFormError({ ...formError, cardHolder: "" })
                  }}
                  error={formError.cardHolder}
                />

                <div className="card-row">
                  <Input
                    label="Ngày Hết Hạn"
                    placeholder="MM/YY"
                    value={cardData.expiryDate}
                    onChange={handleExpiryDateChange}
                    error={formError.expiryDate}
                    maxLength={5}
                  />

                  <Input
                    label="CVV"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={handleCVVChange}
                    error={formError.cvv}
                    maxLength={3}
                    type="password"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "bank_transfer" && (
              <div className="bank-transfer-info">
                <h2>Thông Tin Chuyển Khoản</h2>
                <div className="info-box">
                  <p>
                    <strong>Ngân Hàng:</strong> Vietcombank
                  </p>
                  <p>
                    <strong>Số Tài Khoản:</strong> 1234567890
                  </p>
                  <p>
                    <strong>Chủ Tài Khoản:</strong> TourBook Co., Ltd
                  </p>
                  <p>
                    <strong>Nội Dung Chuyển:</strong> BOOKING-{bookingId}
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === "wallet" && (
              <div className="wallet-info">
                <h2>Ví Điện Tử</h2>
                <p>Bạn sẽ được chuyển hướng đến trang ví điện tử để hoàn tất thanh toán.</p>
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} style={{ width: "100%" }}>
              Thanh Toán {formatCurrency(total)}
            </Button>
          </form>
        </div>

        <div className="payment-summary">
          <div className="summary-card">
            <h2>Tóm Tắt Đơn Hàng</h2>

            <div className="summary-item">
              <span>Mã Booking:</span>
              <span className="value">{bookingId}</span>
            </div>

            <div className="summary-item">
              <span>Phương Thức:</span>
              <span className="value">
                {paymentMethod === "credit_card" && "Thẻ Tín Dụng"}
                {paymentMethod === "bank_transfer" && "Chuyển Khoản"}
                {paymentMethod === "wallet" && "Ví Điện Tử"}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-item total">
              <span>Tổng Tiền:</span>
              <span className="value">{formatCurrency(total)}</span>
            </div>

            <div className="security-info">
              <p>🔒 Thanh toán an toàn và được bảo mật</p>
              <p>✓ Không lưu thông tin thẻ</p>
              <p>✓ Mã hóa SSL 256-bit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
