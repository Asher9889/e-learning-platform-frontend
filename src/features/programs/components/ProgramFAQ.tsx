import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "how do i apply?",
    answer:
      "you can apply online by clicking the 'apply now' button on any program card. fill out the application form with your details, upload the required documents, and submit. our admissions team will review your application and get back to you within 2-3 business days.",
  },
  {
    question: "can i pay fees online?",
    answer:
      "yes, we offer multiple online payment options including credit/debit cards, net banking, upi, and popular digital wallets. you can pay the full fee upfront or opt for our easy installment plans. all transactions are secured with industry-standard encryption.",
  },
  {
    question: "what documents are required?",
    answer:
      "generally, you'll need your previous academic transcripts, id proof (aadhaar/pan/passport), passport-sized photographs, and any relevant certificates. specific document requirements may vary by program. you'll receive a complete checklist after submitting your application.",
  },
  {
    question: "can i study remotely?",
    answer:
      "absolutely! we offer online and hybrid learning modes for most programs. our online programs feature live interactive classes, recorded lectures, digital study materials, and virtual lab sessions. you can learn from anywhere with a stable internet connection.",
  },
  {
    question: "when does admission start?",
    answer:
      "admissions for the academic year 2025-26 are now open. we have multiple intake cycles throughout the year. early bird applicants receive priority consideration and exclusive scholarship opportunities. contact our admissions team for specific start dates.",
  },
];

export function ProgramFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="superr"
      style={{
        padding: "0 24px 64px",
        background: "var(--color-dew-drop)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <h2
            className="display-headline"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              margin: "0 0 6px",
              textTransform: "lowercase",
            }}
          >
            frequently asked questions
          </h2>
          <p
            style={{
              fontFamily: "var(--font-geist)",
              fontSize: 14,
              color: "var(--color-charcoal)",
              opacity: 0.6,
              textTransform: "lowercase",
            }}
          >
            everything you need to know about our programs and admission process.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="product-card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 24px",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-gelica)",
                      fontSize: 16,
                      color: "var(--color-cocoa-ink)",
                      textTransform: "lowercase",
                    }}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      color: "var(--color-marker-orange)",
                      transition: "transform 0.3s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  />
                </div>
                <div
                  style={{
                    maxHeight: isOpen ? 300 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      padding: "0 24px 18px",
                      fontFamily: "var(--font-geist)",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "var(--color-charcoal)",
                      opacity: 0.7,
                      textTransform: "lowercase",
                    }}
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
