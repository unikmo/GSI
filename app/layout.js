export const metadata = { title: 'GSI test build', description: 'Structure test. Unreviewed data.' };

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '40px auto', padding: '0 16px', lineHeight: 1.5 }}>
        {children}
      </body>
    </html>
  );
}
