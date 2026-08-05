import { Container, Divider, Stack, Typography } from "@mui/material";

export default function About() {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h3" fontWeight={700}>
          About SBIMS
        </Typography>
        <Divider />

        <Typography variant="body1">
          The SBIMS is an academic capstone project designed to explore the
          design, development, and evaluation of an internship management
          platform for higher education institutions.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          Project Overview
        </Typography>

        <Typography>
          SBIMS aims to provide a centralized system for managing internship
          related activities, including student records, internship placements,
          company information, evaluations, and related administrative
          processes.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          Capstone Project Title
        </Typography>

        <Typography>
          Design, Development, and Evaluation of a Serverless-Based Internship
          Management System for Higher Education Institutions
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          Purpose
        </Typography>

        <Typography>
          This project was developed to demonstrate the application of modern
          software development practices, serverless architecture concepts, and
          information system design principles in creating an internship
          management solution.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          Development Status
        </Typography>

        <Typography>
          SBIMS is currently under active development. Features, interfaces, and
          system capabilities may change as the project progresses through
          implementation, testing, and evaluation.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          Prototype Interface
        </Typography>

        <Typography>
          This application serves as the user interface representation of the
          SBIMS functional prototype currently being developed. It provides the
          frontend experience for interacting with the system and demonstrates
          the intended workflows, features, and user interactions of the
          proposed internship management solution.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          Academic Project Notice
        </Typography>

        <Typography>
          SBIMS is developed solely for educational, research, demonstration,
          and evaluation purposes. It is not a commercial software product or
          service.
        </Typography>

        <Divider />
      </Stack>
    </Container>
  );
}
