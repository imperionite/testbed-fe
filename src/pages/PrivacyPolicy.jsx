import { Container, Stack, Typography, Divider } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h3" fontWeight={700}>
          Privacy Policy
        </Typography>

        <Typography color="text.secondary">
          Last updated: August 2026
        </Typography>

        <Divider />

        <Typography variant="body1">
          The SBIMS is an academic capstone project developed for educational,
          research, demonstration, and evaluation purposes. This Privacy Policy
          explains how information may be collected, stored, and used while
          interacting with the system.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          1. Educational Purpose
        </Typography>

        <Typography>
          SBIMS is not a commercial software service. The system is designed as
          a prototype internal management system that demonstrates the design,
          development, and evaluation of an internship management platform for
          higher education institutions.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          2. Information We Collect
        </Typography>

        <Typography>
          Depending on system usage, SBIMS may process information such as:
        </Typography>

        <Typography component="ul">
          <li>User account information</li>
          <li>Name and profile information</li>
          <li>Email addresses</li>
          <li>Internship records and related details</li>
          <li>Company or organization information</li>
          <li>Internship documents and evaluation records</li>
          <li>System activity information required for operation</li>
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          3. Synthetic and Test Data
        </Typography>

        <Typography>
          Users, developers, and evaluators are encouraged to use synthetic,
          fictional, anonymized, or test information when interacting with
          SBIMS.
        </Typography>

        <Typography>
          Users are advised not to submit real sensitive personal information,
          including government identification numbers, financial information,
          private documents, or other personally identifiable information (PII)
          unless explicitly required for a controlled evaluation activity.
        </Typography>

        <Typography>
          The use of disposable or non-personal email addresses is recommended
          for testing purposes.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          4. Use of Information
        </Typography>

        <Typography>
          Information processed by SBIMS is used only for purposes related to
          system functionality, testing, demonstration, evaluation, and
          improvement of the academic project.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          5. Data Security
        </Typography>

        <Typography>
          Reasonable technical measures are implemented to protect information
          within the scope of this academic project. However, SBIMS should not
          be considered a production-grade system unless additional security
          reviews, compliance assessments, and operational controls are
          implemented.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          6. Data Retention
        </Typography>

        <Typography>
          Data may be retained only as necessary for development, testing,
          evaluation, and demonstration purposes. Test data may be removed or
          modified during system maintenance.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          7. User Responsibility
        </Typography>

        <Typography>
          Users are responsible for ensuring that information they provide is
          appropriate for an academic testing environment and does not expose
          unnecessary personal or confidential information.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          8. Changes to This Policy
        </Typography>

        <Typography>
          This Privacy Policy may be updated as the SBIMS project evolves during
          development and evaluation.
        </Typography>

        <Divider />
      </Stack>
    </Container>
  );
}
