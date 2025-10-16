# EmailJS Setup Guide for EVOL Jewels

## 1. Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Create Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID** (e.g., `service_abc123`)

## 3. Create Email Template

1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Use one of the provided template codes:
   - **Basic Template**: Use `emailjs-template-basic.html` (recommended for testing)
   - **Advanced Template**: Use `emailjs-template.html` for rich styling
   - **Simple Template**: Use `emailjs-template-simple.html` for better compatibility

**Start with the basic template first** to ensure everything works, then upgrade to advanced styling.

### Template Variables Used:
- `{{to_email}}` - Recipient's email
- `{{product_name}}` - Product name
- `{{product_price}}` - Formatted price (e.g., "₹68,963")
- `{{product_image}}` - Product image URL (converted to absolute URL)
- `{{product_url}}` - Product page URL
- `{{purity}}` - Selected purity (14kt/18kt)
- `{{color}}` - Selected color (YELLOW GOLD, ROSE GOLD, WHITE GOLD)
- `{{message}}` - Personal message (optional)
- `{{from_name}}` - "EVOL Jewels"

**Note**: Product images are automatically converted from relative paths (e.g., `/images/product.jpg`) to absolute URLs (e.g., `https://yoursite.com/images/product.jpg`) to ensure they display properly in emails.

4. Save the template and note down your **Template ID** (e.g., `template_xyz789`)

## 4. Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `user_abcdef123`)

## 5. Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Update .env file** with your EmailJS credentials:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_actual_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
   VITE_EMAILJS_FROM_NAME=EVOL Jewels
   ```

3. **Restart your development server** after updating .env:
   ```bash
   npm run dev
   ```

**Important**: Never commit your .env file to version control. It's already added to .gitignore.

## 6. Test the Feature

1. Go to any product page
2. Click the share button (📤 icon)
3. Enter an email address
4. Add optional message
5. Click "Send Email"
6. Check if email is received

## 7. Email Template Customization

### To customize the email design:

1. **Colors**: Update the CSS variables in the template
2. **Logo**: Replace "EVOL" text with an image if needed
3. **Social Links**: Update the footer social media links
4. **Content**: Modify the text and messaging

### Brand Colors Used:
- Primary Dark: `#1f2937`
- Secondary Dark: `#374151`
- Text Primary: `#111827`
- Text Secondary: `#4b5563`
- Text Muted: `#6b7280`
- Background: `#f9fafb`
- Border: `#e5e7eb`

## 8. Troubleshooting

### Common Issues:

1. **422 Error (Template Parameter Mismatch)**:
   - Most common issue - template variables don't match
   - Use the `emailjs-template-basic.html` for a simple working template
   - Ensure all variables in template match exactly: `{{product_name}}`, `{{product_price}}`, etc.
   - Check EmailJS template editor for syntax errors

2. **Template not found**: Check Template ID is correct
3. **Service error**: Verify Service ID and email service setup  
4. **Authentication error**: Check Public Key is correct
5. **Email not received**: Check spam folder, verify email service configuration

### Testing Tips:

- Use your own email for initial testing
- Check EmailJS dashboard for send logs
- Verify all template variables are populated
- Test on different email clients (Gmail, Outlook, etc.)

## 9. Production Considerations

1. **Rate Limits**: Free EmailJS accounts have monthly limits
2. **Custom Domain**: Consider upgrading for custom sender domain
3. **Analytics**: Monitor email delivery rates in EmailJS dashboard
4. **Backup**: Keep template code backed up

## 10. Security Notes

- Never expose your Private Key in frontend code
- Public Key is safe to use in client-side applications
- Consider implementing rate limiting on your end
- Monitor for abuse and implement captcha if needed

---

**Need Help?**
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/