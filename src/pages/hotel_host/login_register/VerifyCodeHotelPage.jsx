
import React, { useState, useRef, useEffect } from "react"
import { Container, Form, Button, Card } from "react-bootstrap"
import * as Routers from "../../../utils/Routes"
import Banner from "../../../images/banner.jpg"
import { useLocation, useNavigate } from "react-router-dom"

const VerifyCodeHotelPage = () => {
  const location= useLocation();
  const {status}= location.state
  console.log(status)
  const navigate= useNavigate();
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    // Update the code array
    const newCode = [...verificationCode]
    newCode[index] = value.slice(0, 1) // Only take the first character
    setVerificationCode(newCode)

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!verificationCode[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    // Check if pasted content is a number and has appropriate length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 6)
      const newCode = [...verificationCode]

      digits.forEach((digit, index) => {
        if (index < 6) newCode[index] = digit
      })

      setVerificationCode(newCode)

      // Focus the next empty input or the last input if all are filled
      const nextEmptyIndex = newCode.findIndex((val) => !val)
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus()
      } else if (newCode[5]) {
        inputRefs.current[5]?.focus()
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const code = verificationCode.join("")
    console.log("Verification code submitted:", code)

    // Navigate to reset password page if code is complete
    if (code.length === 6) {
      if(status == "REGISTER"){
        navigate('/BookingRegistration');
      }else{
        navigate(Routers.ResetPasswordHotelPage)
      }
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        backgroundImage: `url(${Banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container className="position-relative">
        <Card className="mx-auto shadow" style={{ maxWidth: "800px" }}>
          <Card.Body className="p-4 p-md-5">
            <h2 className="text-center mb-2">Verify Code</h2>
            <div className="text-center mb-4">
              <span className="text-muted">The code is sent to your email</span>
              <br />
              <span className="text-muted">Please check your email to receive the code</span>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: 500 }}>Verification Code</Form.Label>
                <div className="d-flex justify-content-between gap-2 mt-3">
                  {verificationCode.map((digit, index) => (
                    <div key={index} className="position-relative" style={{ flex: "1" }}>
                      <Form.Control
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="text-center py-2"
                        style={{
                          width: "100px",
                          height: "48px",
                          borderColor: index === 0 && !digit ? "#0d6efd" : "#dee2e6",
                          borderWidth: index === 0 && !digit ? "2px" : "1px",
                        }}
                        maxLength={1}
                        autoFocus={index === 0}
                      />
                    </div>
                  ))}
                </div>
              </Form.Group>

              <div className="text-center mb-3">
                <span className="text-muted">Didn't receive the code? </span>
                <a href="#" className="text-decoration-none">
                  Resend code
                </a>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 mt-2"
                disabled={verificationCode.some((digit) => !digit)}
              >
                {status == "REGISTER" ? "Verify Code" : "Reset Password"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default VerifyCodeHotelPage

