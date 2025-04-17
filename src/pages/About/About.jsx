import "./About.scss";
import neko from "../../assets/images/vectors/neko/neko.gif";
import aboutText from "../../assets/images/vectors/about/about_text.png";
import founder from "../../assets/images/founder.jpg";
import { useTheme } from "@mui/material/styles";

import { Box, Grid, Typography } from "@mui/material";

const About = () => {
  const theme = useTheme();

  return (
    <Grid
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={10}
      paddingY={{
        xs: 15,
        sm: 10,
        md: 10,
        lg: 20,
      }}
      paddingInline={{
        xs: 1,
        sm: 2,
        md: 10,
        lg: 20,
      }}
      sx={{
        backgroundColor: theme.colors.green,
      }}
    >
      {/* Top */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        flexDirection={"row"}
      >
        <Grid
          size={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection={{
            xs: "column-reverse",
            sm: "row",
            md: "row",
            lg: "row",
          }}
        >
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
            }}
            alignItems="center"
            display="flex"
            justifyContent="center"
          >
            <Box
              component={"img"}
              src={neko}
              sx={{
                height: "100%",
                width: { xs: "60%", md: "100%" },
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
              lg: 6,
            }}
          >
            <Box
              component={"img"}
              src={aboutText}
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                mt: { xs: 5, md: 0 },
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Bottom */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        flexDirection={{
          xs: "column",
          sm: "column",
          md: "row",
          lg: "row",
        }}
        gap={{
          xs: 1,
          sm: 3,
          md: 7,
          lg: 10,
        }}
        borderRadius={{
          xs: 1,
          sm: 3,
          md: 7,
          lg: 10,
        }}
        p={{
          xs: 2,
          sm: 3,
          md: 7,
          lg: 10,
        }}
        sx={{
          backgroundColor: theme.colors.beige,
          boxShadow: { xs: "none", md: `8px 8px 0px 0px ${theme.colors.pink}` },
        }}
      >
        <Grid
          size={{
            xs: 6,
            sm: 12,
            md: 4,
            lg: 4,
          }}
        >
          <Box
            component="img"
            src={founder}
            sx={{
              width: "100%",
              objectFit: "cover",
              borderRadius: 5,
            }}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 6,
            lg: 6,
          }}
          height="100%"
        >
          <Typography
            mt={4}
            textAlign="justify"
            fontWeight={300}
            fontFamily={theme.fonts.text}
            color={theme.colors.green}
            fontSize={{
              xs: 14,
              sm: 14,
              md: 14,
              lg: 20,
            }}
          >
            Umi 海 comes from the Japanese word ocean.
          </Typography>
          <Typography
            textAlign="justify"
            mt={4}
            fontWeight={300}
            fontSize={{
              xs: 14,
              sm: 14,
              md: 14,
              lg: 20,
            }}
            fontFamily={theme.fonts.text}
            color={theme.colors.pink}
          >
            Umi matcha was inspired by the famous Japanese painting, "The Great
            Wave of Kanagawa". Matcha has been a constant in my life through its
            highest highs and lowest lows and just like that, the great wave
            depicts life's journey. It is a never-ending process where once we
            conquer our fear and meet our goal, we'll be met again with other
            vicious waves, other bigger problems & difficulties. However, our
            tiredness towards the journey will also have it's sweetness, when we
            reach a calm sea, where it's wave is gentle, and we can feel the
            summer breeze warm our mind, body, and soul. But, with the knowledge
            that another wave is waiting to be conquered. Umi Matcha represents
            a symbolic shift within the matcha community.
          </Typography>
          <Typography
            textAlign="justify"
            mt={4}
            fontWeight={300}
            fontFamily={theme.fonts.text}
            color={theme.colors.pink}
            fontSize={{
              xs: 14,
              sm: 14,
              md: 14,
              lg: 20,
            }}
          >
            I'm thrilled to have Umi become a part of your daily routine because
            it's truly the most magical part of mine.
            <Typography
              p={5}
              alignItems={"end"}
              display="flex"
              justifyContent={"end"}
              color={theme.colors.green}
              fontSize={{
                xs: 14,
                sm: 14,
                md: 14,
                lg: 20,
              }}
            >
              - Adviti, Founder
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default About;
