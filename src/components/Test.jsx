import { Box, Typography, useTheme } from "@mui/material";
const Test = () => {
  const theme = useTheme();
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor={theme.colors.green}
      p={2}
    >
      <Typography color={theme.colors.beige}>
        <p className="tagline">
          Premium Ceremonial Grade Matcha{" "}
          <em>
            {" "}
            From Kirishima, Kagoshima, Japan - Single origin, Three farmers
          </em>
        </p>
        <p className="description">
          <strong>Floral, Umami &amp; Fresh </strong> <br />
          Single origin, 100% certified organic, First Harvest matcha grown in
          the mineral rich volcanic soils of Kagoshima. This matcha is grown at
          the edge of the volcano in the pristine regions of southern Japan,
          where the unique misty weather pattern fosters the flavour and growth
          of this matcha. This matcha is naturally grown in a pesticide free
          environment. Double cover shading for 20 days. Stone milled &amp;
          ground.
        </p>
        <p className="summary">
          We taste: Jasmine, Wildflower Honey and Cream.
        </p>
        <p className="full-description">
          Full description: Nozomi by Umi is a ceremonial matcha that is
          vibrant, smooth and umami rich. This ceremonial matcha is emerald
          green and is complemented by light floral sweetness, the absence of
          bitterness, smooth and velvety texture, which makes it ideal for
          mindful rituals and sustained energy with unmatched quality.
        </p>
      </Typography>
    </Box>
  );
};

export default Test;
