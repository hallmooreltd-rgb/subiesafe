import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export type DocumentType =
  | 'variation-order'
  | 'delay-notice'
  | 'payment-notice'
  | 'pay-less-notice'
  | 'daywork-sheet'
  | 'site-instruction-record'

export const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  'variation-order': 'Variation Order',
  'delay-notice': 'Delay Notice',
  'payment-notice': 'Payment Notice',
  'pay-less-notice': 'Pay Less Notice',
  'daywork-sheet': 'Daywork Sheet',
  'site-instruction-record': 'Site Instruction Record',
}

export async function classifyDocument(input: string): Promise<DocumentType> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a UK construction law expert. Classify the following informal communication into one of these document types:
- variation-order: Extra work, scope changes, additional tasks not in original contract
- delay-notice: Delays caused by others, weather, access issues, late materials
- payment-notice: Claiming payment for work done, invoicing
- pay-less-notice: Disputing or reducing a payment application
- daywork-sheet: Time and materials worked on specific dates
- site-instruction-record: Instructions received verbally from site manager

Respond with ONLY the document type key, nothing else.`,
      },
      { role: 'user', content: input },
    ],
    max_tokens: 50,
  })

  const type = response.choices[0].message.content?.trim() as DocumentType
  const validTypes: DocumentType[] = [
    'variation-order',
    'delay-notice',
    'payment-notice',
    'pay-less-notice',
    'daywork-sheet',
    'site-instruction-record',
  ]
  return validTypes.includes(type) ? type : 'site-instruction-record'
}

export async function generateDocument(
  input: string,
  docType: DocumentType,
  contractorName: string = 'The Subcontractor',
  projectName: string = 'The Project'
): Promise<Record<string, unknown>> {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const prompts: Record<DocumentType, string> = {
    'variation-order': `You are a UK construction contracts expert. Generate a formal Variation Order under HGCRA 1996.
Return JSON with these fields:
{
  "title": "Variation Order",
  "documentNumber": "VO-[auto number like 001]",
  "date": "${today}",
  "contractor": "${contractorName}",
  "project": "${projectName}",
  "description": "Detailed description of the variation",
  "scopeOfWork": ["bullet point 1", "bullet point 2"],
  "estimatedCost": "Cost in £ or TBC",
  "timeImpact": "Number of days or TBC",
  "legalBasis": "Under clause X of the subcontract and HGCRA 1996",
  "signatoryLine": "Authorised Signature: _________________ Date: _________________",
  "footer": "This Variation Order is issued under the Housing Grants, Construction and Regeneration Act 1996"
}`,
    'delay-notice': `You are a UK construction contracts expert. Generate a formal Delay Notice under HGCRA 1996.
Return JSON with these fields:
{
  "title": "Notice of Delay",
  "documentNumber": "DN-[auto number]",
  "date": "${today}",
  "contractor": "${contractorName}",
  "project": "${projectName}",
  "causeOfDelay": "Description of the cause",
  "dateDelayCommenced": "${today}",
  "anticipatedDuration": "Days affected",
  "impactOnWorks": "Description of impact",
  "remediesRequired": ["Remedy 1", "Remedy 2"],
  "extensionOfTimeClaimed": "Number of days",
  "legalBasis": "Under HGCRA 1996 and the subcontract agreement",
  "footer": "This notice is served pursuant to the Housing Grants, Construction and Regeneration Act 1996"
}`,
    'payment-notice': `You are a UK construction contracts expert. Generate a formal Payment Notice under HGCRA 1996 Section 110A.
Return JSON with these fields:
{
  "title": "Payment Notice",
  "documentNumber": "PN-[auto number]",
  "date": "${today}",
  "contractor": "${contractorName}",
  "project": "${projectName}",
  "paymentDueDateFinal": "Date",
  "workCompleted": "Description",
  "lineItems": [{"description": "Item", "quantity": "1", "rate": "£0", "total": "£0"}],
  "subtotal": "£0",
  "vatAmount": "£0",
  "totalAmount": "£0",
  "paymentDueDate": "28 days from notice",
  "bankDetails": "Sort code and account to be provided",
  "legalBasis": "Section 110A Housing Grants, Construction and Regeneration Act 1996",
  "footer": "Payment is due within the period specified in the subcontract or, if none, within 30 days"
}`,
    'pay-less-notice': `You are a UK construction contracts expert. Generate a formal Pay Less Notice under HGCRA 1996 Section 111.
Return JSON with these fields:
{
  "title": "Pay Less Notice",
  "documentNumber": "PLN-[auto number]",
  "date": "${today}",
  "contractor": "${contractorName}",
  "project": "${projectName}",
  "originalNoticeReference": "Ref",
  "originalAmount": "£0",
  "deductions": [{"reason": "Reason", "amount": "£0"}],
  "totalDeductions": "£0",
  "amountProposedToPay": "£0",
  "basisForDeductions": "Detailed explanation",
  "legalBasis": "Section 111 Housing Grants, Construction and Regeneration Act 1996",
  "footer": "This Pay Less Notice is served in accordance with HGCRA 1996 Section 111"
}`,
    'daywork-sheet': `You are a UK construction contracts expert. Generate a formal Daywork Sheet.
Return JSON with these fields:
{
  "title": "Daywork Sheet",
  "documentNumber": "DW-[auto number]",
  "date": "${today}",
  "contractor": "${contractorName}",
  "project": "${projectName}",
  "siteManager": "Name or TBC",
  "labourItems": [{"date": "${today}", "operative": "Name", "hours": "8", "rate": "£0/hr", "total": "£0"}],
  "plantItems": [{"description": "Item", "hours": "0", "rate": "£0/hr", "total": "£0"}],
  "materialItems": [{"description": "Item", "quantity": "1", "unit": "nr", "rate": "£0", "total": "£0"}],
  "labourTotal": "£0",
  "plantTotal": "£0",
  "materialsTotal": "£0",
  "grandTotal": "£0",
  "siteManagerSignature": "Signature: _________________ Date: _________________",
  "footer": "Daywork rates are in accordance with the RICS Schedule of Basic Plant Charges or as agreed in subcontract"
}`,
    'site-instruction-record': `You are a UK construction contracts expert. Generate a formal Site Instruction Record.
Return JSON with these fields:
{
  "title": "Site Instruction Record",
  "documentNumber": "SI-[auto number]",
  "date": "${today}",
  "contractor": "${contractorName}",
  "project": "${projectName}",
  "instructionGivenBy": "Name / Title",
  "instructionGivenVia": "Verbal / WhatsApp / Email",
  "timeOfInstruction": "Time",
  "instructionDetails": "Full description of instruction",
  "workAffected": "Description of work affected",
  "potentialCostImpact": "£ or TBC",
  "acknowledgement": "I confirm this instruction was received and work will be carried out subject to agreement on costs and programme.",
  "witnessedBy": "Name or N/A",
  "footer": "This record is created to document verbal or informal instructions in accordance with best practice for dispute avoidance"
}`,
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: prompts[docType],
      },
      {
        role: 'user',
        content: `Generate the document based on this communication:\n\n${input}\n\nRespond with valid JSON only, no markdown.`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 2000,
  })

  const content = response.choices[0].message.content || '{}'
  return JSON.parse(content)
}
