import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I apply?",
    answer:
      "You can apply online by clicking the 'Apply Now' button on any program card. Fill out the application form with your details, upload the required documents, and submit. Our admissions team will review your application and get back to you within 2-3 business days.",
  },
  {
    question: "Can I pay fees online?",
    answer:
      "Yes, we offer multiple online payment options including credit/debit cards, net banking, UPI, and popular digital wallets. You can pay the full fee upfront or opt for our easy installment plans. All transactions are secured with industry-standard encryption.",
  },
  {
    question: "What documents are required?",
    answer:
      "Generally, you'll need your previous academic transcripts, ID proof (Aadhaar/PAN/Passport), passport-sized photographs, and any relevant certificates. Specific document requirements may vary by program. You'll receive a complete checklist after submitting your application.",
  },
  {
    question: "Can I study remotely?",
    answer:
      "Absolutely! We offer online and hybrid learning modes for most programs. Our online programs feature live interactive classes, recorded lectures, digital study materials, and virtual lab sessions. You can learn from anywhere with a stable internet connection.",
  },
  {
    question: "When does admission start?",
    answer:
      "Admissions for the academic year 2025-26 are now open. We have multiple intake cycles throughout the year. Early bird applicants receive priority consideration and exclusive scholarship opportunities. Contact our admissions team for specific start dates.",
  },
];

export function ProgramFAQ() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-2 text-muted-foreground">
            Everything you need to know about our programs and admission process.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
