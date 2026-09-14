import { Container, Stack, Typography, Divider } from "@mui/material";

export default function TermsConditions() {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h3" fontWeight={700}>
          Terms and Conditions
        </Typography>

        <Typography color="text.secondary">
          Last updated: August 2026
        </Typography>

        <Divider />

        <Typography>
          Welcome to the SBIMS. By accessing or using this system, users
          acknowledge and agree to the following terms and conditions.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          1. Academic Project Use
        </Typography>

        <Typography>
          SBIMS is an academic capstone project developed for educational,
          research, demonstration, and evaluation purposes. The system is not
          provided as a commercial software service.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          2. Intended Use
        </Typography>

        <Typography>
          The system is intended to demonstrate an internship management
          platform concept for higher education institutions. Any production
          deployment requires additional development, security review,
          maintenance, and operational support.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          3. User Accounts
        </Typography>

        <Typography>
          Users are responsible for maintaining the security of their account
          credentials and should avoid sharing account access with unauthorized
          individuals.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          4. Acceptable Use
        </Typography>

        <Typography>
          Users agree not to misuse the system, attempt unauthorized access,
          disrupt system operation, or submit inappropriate, unlawful, or
          harmful content.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          5. Data Accuracy
        </Typography>

        <Typography>
          Users are responsible for the accuracy of information they provide.
          Since SBIMS may be used with synthetic or test data, information
          displayed in the system may not represent real-world records.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          6. Intellectual Property
        </Typography>

        <Typography>
          SBIMS and its associated source code, documentation, and materials are
          part of an academic software project developed by the project team.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          7. Disclaimer
        </Typography>

        <Typography>
          SBIMS is provided on an "as-is" basis for academic purposes. The
          developers do not guarantee uninterrupted availability, complete
          accuracy, or suitability for production environments.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          8. Limitation of Liability
        </Typography>

        <Typography>
          The project developers shall not be held responsible for any loss,
          damages, or issues resulting from the use of this academic prototype.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          9. Changes to These Terms
        </Typography>

        <Typography>
          These Terms and Conditions may be updated as the SBIMS project
          progresses through development and evaluation.
        </Typography>

        <Divider />
      </Stack>
    </Container>
  );
}
