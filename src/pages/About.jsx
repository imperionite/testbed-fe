import { Container, Stack, Typography } from "@mui/material";

export default function About() {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          About SBIMS
        </Typography>

        <Typography variant="body1">
          The SBIMS is an academic capstone project designed to explore the
          design, development, deployment, and evaluation of a serverless-based
          internship management platform for higher education institutions.
        </Typography>

        <Typography variant="h5" fontWeight={600}>
          Project Overview
        </Typography>

        <Typography>
          SBIMS is a serverless-based Internship Management System designed to
          explore the development and evaluation of a cloud-native information
          system for Higher Education Institutions. The system centralizes
          internship-related workflows, including student records, internship
          placements, evaluations, and administrative processes, through an
          API-driven architecture that separates the frontend experience from
          backend services.
        </Typography>

        <Typography>
          Beyond implementing internship management functionalities, the project
          investigates the practical application of serverless backend
          development using modern web technologies, managed cloud services, and
          lightweight runtime environments. The system serves as a functional
          software artifact for evaluating implementation considerations,
          performance behavior, and usability of a serverless-based approach
          within an academic information system context.
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
          System Architecture Approach
        </Typography>

        <Typography>
          SBIMS adopts a headless, serverless-based application architecture
          that separates the frontend interface from backend services through an
          API-driven design. The frontend serves as the presentation layer,
          while the backend API manages authentication, business logic, data
          operations, and system services.
        </Typography>

        <Typography>
          The architecture utilizes lightweight cloud-native technologies and
          managed services to reduce infrastructure management complexity while
          supporting a modular, maintainable, and deployable information system
          design. This approach demonstrates the practical application of
          serverless computing concepts within the context of higher education
          internship management.
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

        <Typography>
          The frontend communicates with the serverless backend API through an
          API-driven architecture, allowing the prototype interface to
          demonstrate the interaction between the user experience layer and
          cloud-based backend services.
        </Typography>
      </Stack>
    </Container>
  );
}
