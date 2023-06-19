import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { SuggestionInfoIcon } from "../../images/icons/SuggestionInfoIcon";

interface SolutionProps {
  header: string;
  body: string;
  onPressLearnMore: () => void;
  onPressFixNow: () => void;
}

interface AiSuggestCardProps {
  question: string;
  onPressInfo: () => void;
  solutions: SolutionProps[];
  severity: "high" | "medium" | "low";
}

const AiSuggestCard = ({
  question,
  solutions,
  severity,
}: AiSuggestCardProps) => {
  return (
    <Box
      sx={{
        border: "1px solid #4caf50",
        borderRadius: 1,
        bgcolor: "#ECFDF2",
        p: 2,
        mb: "18px",
      }}
    >
      <Box display={"flex"} justifyContent={"space-between"} p={0}>
        <Typography
          sx={{ fontWeight: 600, fontSize: 14, color: "rgba(6, 80, 44, 1)" }}
        >
          {question}
        </Typography>
        <SuggestionInfoIcon />
      </Box>
      {solutions.map((s) => (
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.5)",
            my: "13px",
            fontSize: 14,
            p: "16px",
          }}
        >
          <Box
            sx={{
              p: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "165px",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>{s.header}</Typography>
            <Typography sx={{ fontWeight: 400 }}>{s.body}</Typography>
            <Box
              sx={{
                fontWeight: 600,
                p: "0",
              }}
            >
              <Button
                sx={{ color: "rgba(45, 48, 53, 1)" }}
                size="small"
                onClick={s.onPressFixNow}
              >
                Fix Now
              </Button>
              <Button
                sx={{ color: "rgba(45, 48, 53, 1)" }}
                size="small"
                onClick={s.onPressLearnMore}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AiSuggestCard;
