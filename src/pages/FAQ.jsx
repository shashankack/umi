import { Accordion, Box, useTheme, useMediaQuery } from "@mui/material";

const faqData = [
  {
    topic: "Matcha 101",
    content: [
      {
        question: "What is Matcha?",
        answer:
          "Matcha is a finely ground powder made from shade-grown tencha leaves, a specific type of green tea. Unlike regular green tea, where the leaves are steeped and removed, matcha is whisked into water or milk and consumed entirely, allowing you to ingest the whole leaf.",
      },
      {
        question: "How is Matcha made?",
        answer: `<ul>
        <li>
          <strong>Shade grown leaves:</strong> About 3-4 weeks before harvest,
          the tea plants are covered to block direct sunlight. This process
          boosts chlorophyll levels, giving the leaves a vibrant green colour
          and a naturally sweeter, umami-rich flavour.
        </li>
        <li>
          <strong>Handpicked during Harvest Seasons:</strong> Only the youngest,
          most tender leaves from the top of the tea plant are carefully
          handpicked during the harvest season. Each seasonal harvest brings
          subtle differences in flavour, aroma and colour, contributing to the
          unique character of every batch of matcha.
        </li>
        <li>
          <strong>Stone-Ground into fine powder:</strong> After steaming and
          drying the leaves (called tencha) are slowly ground using traditional
          granite stone mills. This method preserves the delicate flavour, aroma
          and nutrients resulting in a silky, vibrant green powder which is
          matcha.
        </li>
      </ul>`,
      },
      {
        question: "Matcha’s Health Benefits",
        answer:
          "Matcha is loved not just for its flavour, but also for its powerful health benefits. It can help boost metabolism, enhance focus and energy, and is packed with antioxidants – especially catechins like EGCG, which support overall wellbeing. Unlike coffee, matcha provides a calmer, more sustained energy boost thanks to the combination of caffeine and L-theanine.",
      },
      {
        question: "Important things to consider when buying Matcha:",
        answer:
          " It should be made in Japan. It should be a bright green colour (a dull, swampy green is a definite no). The only ingredient should be matcha, which means no sugar, no flavourings, and no milk powder, etc., unless you are buying instant matcha premixes.",
      },
    ],

    topic: "Matcha Terms you need to know:",
    content: [
      {
        question: "Umami: Known as the “Fifth Taste” – Savoury and Rich:",
        answer:
          "Umami comes from Ltheanine and amino acids, creating a smooth, brothy richness – like the savoury depth found in mushrooms or seaweed. Umami is often spotted in high-quality matcha as it adds depth and complexity, making the flavour more layered and balanced.",
      },

      {
        question: "Astringency",
        answer:
          ": A dry, puckering sensation on the tongue. Astringency is a texture or sensation in the mouth rather than a specific taste or smell. It is a key characteristic of matcha and can be a desirable flavour component. It adds complexity to the matcha flavour when well-balanced but excessive astringency can be unpleasant.",
      },
      {
        question: "Vegetal",
        answer:
          "Notes of grass or steamed greens. Vegetal refers to the notes that you taste while sipping matcha. It’s the leafy, green flavour, like freshly picked herbs or steamed spinach. It gives matcha its lively, earthy character.",
      },
      {
        question: "Aroma",
        answer:
          "The smell of matcha, such as floral, nutty, or even cocoa like. Aroma describes the fragrance or scent you experience when you first open the matcha container or inhale after preparation. No matcha is created equal. The aroma of the matcha can be floral, umami-rich, nutty, cocoa like and earthy.",
      },
    ],

    topic: "Matcha Essentials/Tools",
    content: [
      {
        question: "Chawan",
        answer:
          " A chawan is a unique Japanese tea bowl that is used both for whisking and drinking matcha tea. A deep, wide chawan provides enough room for the chasen to move back and forth with ease, which is fundamental for producing froth and dissolving the matcha powder. The chawan's robust shape sits nicely in both hands.",
      },
      {
        question: "Chasen",
        answer:
          "A chasen is also known as the matcha whisk. It is a unique tool hand-crafted out of a single piece of bamboo, especially for whisking matcha powder into the perfect consistency. A standard chasen has anywhere from 80 to 120 prongs. While other matcha tools can potentially be substituted, we do not recommend replacing the chasen. It is an absolutely indispensable part of making matcha green tea.",
      },
      {
        question: "Chashaku",
        answer:
          "A chashaku is a bamboo tea scoop used for measuring the proper amount of matcha powder. One full chashaku scoop of matcha is approximately1 gram. And one serving of matcha tea requires 2-3 grams of the green tea powder. The long elegant shape of the chashaku makes it easy to scoop the perfect amount of matcha each time. Always properly dry your chashaku after each use.",
      },
      {
        question: "Kusenaoshi",
        answer:
          "A Kusenaoshi or whisk holder is a special tool for properly holding your chasen (tea whisk). You may have already noticed that this particular tool comes in an unusual shape. This shape is, in fact, the ideal for keeping your chasen as good as new and preventing it from shrinking. If properly cared for, your chasen can last you a long time, so we recommend investing in a chasen holder from the start. A shrunken chasen makes it all the harder to achieve that rich green foa.",
      },
      {
        question: "Furui",
        answer:
          "A furui or sieve is a tea strainer. Naturally, the matcha powder may have some small clumps, which are hard to break up even after whisking or shaking. Sifting the vibrant green matcha powder beforehand will ensure that the matcha is then effortlessly whisked, creating the smoothest matcha beverage imaginable. Since matcha is an extremely fine powder, we recommend getting a fine sifter to match.",
      },
    ],

    topic: "Types of Matcha",
    content: [
      {
        question: "Culinary Grade:",
        answer:
          "More robust and slightly bitter, ideal for baking and cooking, where its flavour can stand out even when mixed with other ingredients.",
      },
      {
        question: "Cafe/ Latte Grade:",
        answer:
          "A balanced blend with a slightly bolder flavour, designed to pair well with milk while still retaining a smooth and creamy texture.",
      },
      {
        question: "Ceremonial Grade:",
        answer:
          "Made from the youngest, first-harvest leaves and stone-milled for a naturally smooth, umami-rich taste, perfect for drinking straight or in latte form. ",
      },
    ],

    topic: "More Matcha Terms",
    content: [
      {
        question: "Organic",
        answer: `All matcha is not organic. Organic matcha ensures no pesticides,
      herbicides, and no chemical inputs in soil or farming. It constitutes a
      clean, pure final product free of contaminants and sustainable and
      environmentally friendly farming practices. To be certified organic,
      matcha must meet rigorous agricultural standards, often certified by
      organizations like: <strong>JAS (Japan Agricultural Standards)</strong> in
      Japan, <strong>USDA Organic</strong> in the United States,{" "}
      <strong>EU Organic</strong> in Europe.`,
      },
      {
        question: "First Harvest:",
        answer: `First harvest or first flush matcha refers to the tea leaves harvested in
early spring, typically in late April to mid-May in Japan. These leaves are considered
the highest quality and most tender due to their freshness and the time spent under
shade, which enhances flavour and nutrients. This first harvest is often used to make
high-grade ceremonial matcha. First harvest leaves are packed with nutrients and
chlorophyll due to being shaded for a period before harvest. First harvest matcha
contains more L-theanine, an amino acid responsible for the umami flavour.`,
      },
      {
        question: "Single Origin:",
        answer: `Single origin matcha means the matcha is produced from leaves grown
in a single location, which could be a region, a prefecture, or even a single farm. This
contrasts with blended matcha, which is a mixture of matcha from various origins. The
single origin designation highlights the unique characteristics of that specific terroir,
including soil, climate, and farming practices. Single-origin matcha offers a taste profile
reflecting the specific terroir, unlike blended matcha, which often aims for a balanced
and consistent flavour. `,
      },
      {
        question: "Single Cultivar:",
        answer: `Single cultivar matcha means the tea is made from the leaves of only
one specific cultivar of the tea plant. Cultivars are bred or cultivated varieties, meaning
they are selected and grown for specific flavours or characteristics, as opposed to wild
or seed-grown plants. When matcha is labelled as "single cultivar," it means that the
matcha powder is made exclusively from the leaves of one specific tea plant
cultivar. This allows the unique characteristics of that cultivar to shine through in the
flavour profile.`,
      },
      {
        question: "Single Origin vs Single Cultivar: ",
        answer: `While often used interchangeably, "single origin"
refers to the geographic location where the tea leaves are grown, while "single
cultivar" refers to the specific variety of tea plant used.`,
      },
    ],

    topic: "Types of Matcha Harvest",
    content: [
      {
        question: "First Harvest:",
        answer: `Harvested in early spring (April-May). Leaf quality consists of the
youngest, most tender leaves are used. Flavour profile consists of smooth, sweet and
umami-rich. Best used for Ceremonial-grade, premium lattes and usucha. 
`,
      },
      {
        question: "Second Harvest:",
        answer: `Harvested in early summer (June-July). Leaf quality consists of slightly
mature leaves whose flavour profile is slightly bitter and grassy. Best used for daily
drinking and smoothies. `,
      },
      {
        question: "Third Harvest:",
        answer: `Harvested in late summer (August-September). Leaf quality consists of
more mature and tougher leaves whose flavour profile is sharp, earthy and has strong
bitterness with less complexity. Best used for culinary purposes and flavoured drinks.`,
      },
    ],

    topic: "Our Matcha - Kinder rituals that fill your cup",
    content: [
      {
        question: "",
        answer: `Umi is a premium matcha brand crafted from the finest, single-origin, and singlecultivar tea leaves, harvested during the first flush of spring from Japan's most
renowned matcha-growing regions. Cultivated with meticulous care, our matcha is
100% certified organic, free of pesticides, herbicides, and synthetic fertilizers, ensuring
a clean product that retains its natural purity and vibrant green colour. Each batch is
harvested from a single cultivar, allowing for a distinct, consistent flavour profile that
reflects the terroir of its origin. </br></br>
With a smooth, umami-rich taste and a silky texture, our matcha is ideal for both
traditional ceremonial use and contemporary culinary applications—perfect for
discerning matcha enthusiasts seeking exceptional quality in every sip. Our matcha
represents a symbolic change within the matcha community. We hope for our matcha
to stay with you through life’s highest highs and lowest lows. Made with love by
matcha lovers, for matcha lovers.`,
      },
    ],

    topic: "Where does our Matcha come from?",
    content: [
      {
        question: "",
        answer: `We at Umi partner up with matcha manufacturers from Japan’s most renowned
matcha growing regions such as Uji, Wazuka, Shizuoka, Yame, Kagoshima etc, as we
strive to bring the best most refined quality of matcha to you. Our matcha is
Ceremonial, First harvest, mostly organic and strictly Made in Japan.
`,
      },
    ],

    topic: "Why is Matcha so expensive?",
    content: [
        {
            question: "",
            answer: `Matcha is `
        }
    ]
  },
];

const FAQ = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      height="100vh"
      bgcolor={theme.colors.green}
      display="flex"
      justifyContent="center"
      alignItems="center"
    ></Box>
  );
};

export default FAQ;
