import { useMemo } from "react";
import { VisualElementsPanel, SpatialArrangementPanel, FlippableCard, StaticDynamicSlider, type DimensionCard, type CorpusItem } from "@/app/components/DesignSpacePage";
import designspaceDataRaw from "@/data/designspace.json";
import corpusDataRaw from "@/data/corpus.json";

const withBase = (relPath: string) => {
  const base = (import.meta as unknown as { env: { BASE_URL?: string } }).env?.BASE_URL || "/";
  return `${base.replace(/\/+$/, "/")}${relPath.replace(/^\/+/, "")}`;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-bold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base text-muted-foreground leading-relaxed">
      {children}
    </p>
  );
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex gap-10 items-start w-full">
      <div className="flex-1 min-w-0">{left}</div>
      <div className="flex-1 min-w-0">{right}</div>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

function ArticleImage({ src, alt, width = "100%" }: { src: string; alt: string; width?: string }) {
  return (
    <img
      src={withBase(src)}
      alt={alt}
      className="h-auto rounded-lg"
      style={{ width }}
    />
  );
}


export function OverviewPage({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const corpusById = useMemo(() => {
    const map = new Map<string, CorpusItem>();
    (corpusDataRaw as CorpusItem[]).forEach(item => { if (item.id) map.set(item.id, item); });
    return map;
  }, []);

  const { elementTypeCards, elementTypeColor, elementTypeIcon, groupCards, groupColor, groupIcon, mechanismCards, mechanismColor, mechanismIcon } = useMemo(() => {
    type DSJson = { categories: Array<{ category: string; dimensions: Array<{ id: string; color?: string; icon?: string; cards: DimensionCard[] }> }> };
    const data = designspaceDataRaw as DSJson;
    let elementTypeCards: DimensionCard[] = [];
    let elementTypeColor = "#f06951";
    let elementTypeIcon: string | undefined;
    let groupCards: DimensionCard[] = [];
    let groupColor = "#3f4adb";
    let groupIcon: string | undefined;
    let mechanismCards: DimensionCard[] = [];
    let mechanismColor = "#436d41";
    let mechanismIcon: string | undefined;

    const MECHANISM_IDS = ["living-movement", "respiration-rhythms", "force-fields-particles"];

    for (const cat of data.categories) {
      for (const dim of cat.dimensions) {
        if (dim.id === "element-type") {
          elementTypeCards = dim.cards as DimensionCard[];
          elementTypeColor = dim.color ?? elementTypeColor;
          elementTypeIcon = dim.icon ? withBase(dim.icon) : undefined;
        }
        if (dim.id === "groups-and-populations") {
          groupCards = (dim.cards as (DimensionCard & { example?: string })[])
            .filter(c => !["count", "density"].includes(c.id))
            .map(c => ({ ...c, examples: c.examples ?? c.example }));
          groupColor = dim.color ?? groupColor;
          groupIcon = dim.icon ? withBase(dim.icon) : undefined;
        }
        if (dim.id === "biological-mechanisms" || dim.id === "physics-chemical-mechanisms") {
          const matched = (dim.cards as DimensionCard[]).filter(c => MECHANISM_IDS.includes(c.id));
          if (matched.length > 0) {
            mechanismCards.push(...matched);
            mechanismColor = dim.color ?? mechanismColor;
            if (!mechanismIcon) mechanismIcon = dim.icon ? withBase(dim.icon) : undefined;
          }
        }
      }
    }
    // Preserve requested order
    mechanismCards.sort((a, b) => MECHANISM_IDS.indexOf(a.id) - MECHANISM_IDS.indexOf(b.id));

    return { elementTypeCards, elementTypeColor, elementTypeIcon, groupCards, groupColor, groupIcon, mechanismCards, mechanismColor, mechanismIcon };
  }, []);

  return (
    <div className="overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col gap-20">

        {/* Hero */}
        <Section>
          <h1 className="text-5xl font-bold tracking-tight leading-tight max-w-4xl">
            A design space for physically-inspired visualization
          </h1>
          <Body>
            Physically-inspired visualizations are data visualizations that draw on cues from the physical world — such as materials, lighting, depth, deformation, or physically suggestive motion — to communicate data. These cues can function as encodings, provide context, or shape interpretation. To better understand this growing visual vocabulary, we developed a design space grounded in a curated corpus of 103 examples across different media and production methods. It offers a shared framework for analyzing and designing physically-inspired visualizations.
          </Body>
          <Body>
            This website presents that design space in a more visual and accessible form. It introduces the main concepts, shows how the framework is organized, and connects them to examples from the corpus and the design practice.
          </Body>
        </Section>

        {/* What counts */}
        <TwoCol
          left={
            <Section>
              <SectionTitle>Positioning physically-inspired visualization</SectionTitle>
              <Body>
                Physically-inspired visualization cuts across several existing areas rather than belonging to just one. It overlaps with data physicalization, embellished visualization, cinematic visualization, and data videos. What makes it distinctive is that it treats physical-looking cues as the main lens of analysis, whether they appear in photographs of physical artifacts, 2D illustrations, 3D renderings, or animated scenes. Rather than a single genre, it is better understood as a cross-cutting framing: a way of looking at visualizations through the physical cues they use, the processes they suggest, and the roles they play in shaping meaning and interpretation.
              </Body>
            </Section>
          }
          right={
            <ArticleImage src="resources/framing.png" alt="Framing the scene" width="100%" />
          }
        />

        {/* How the design space is organized */}
        <Section>
          <SectionTitle>How the design space is organized</SectionTitle>
          <Body>
            The design space is organized in two connected layers. On the left, it starts with visual elements: the different parts that make up a physically-inspired visualization, such as marks, collections, guides, annotations, decorations, and the scene. Each element can then be described through a set of physical attributes, shown in the center and right of the diagram. These attributes capture what kinds of physical cues are used, whether they encode data or provide context, whether they are static or dynamic, and what kinds of physical or biological processes they may suggest. Together, these layers provide a way to describe how physicality is built into the visualization and how it shapes meaning and interpretation.
          </Body>
          <ArticleImage src="resources/design space.png" alt="Design Space Overview" width="100%" />
        </Section>

        {/* Visual elements */}
        <Section>
          <Section>
            <SectionTitle>Visual elements</SectionTitle>
            <Body>
              We begin by breaking each visualization into visual elements. These include marks and collections, which encode data, as well as guides, annotations, decorations, and the scene, which support interpretation and framing. This decomposition is important because physically-inspired visualizations often combine multiple roles, visual styles, and levels of realism within the same image or video. Looking only at the whole visualization makes these distinctions hard to describe.
            </Body>
            <Body>
              The framework also captures the hierarchy between elements. Marks typically sit at the lowest level, while collections group marks or other collections into larger structures. Support elements can attach to different levels of this hierarchy depending on what they help explain or frame. The scene sits at the highest level, capturing the overall environment, viewpoint, and atmosphere of the visualization. Thinking in terms of element types and hierarchy makes it easier to describe how different parts of the visualization work together, and how physical cues are distributed across the composition.
            </Body>
          </Section>

          <div style={{ width: "fit-content" }}>
            <VisualElementsPanel
              cards={elementTypeCards}
              dimensionColor={elementTypeColor}
              categoryIcon={elementTypeIcon}
            />
          </div>
        </Section>

        {/* Static vs dynamic */}
        <Section>
          <SectionTitle>Static vs dynamic physical cues</SectionTitle>
          <Body>
            Physical attributes can be static or dynamic, and many physically-inspired effects can be shown in either form. Even in dynamic visualizations, some elements may remain fixed, while in static images, processes such as breaking or unfolding can still be suggested through progressive states. Temporality expands the design space by allowing visualizations to represent both states and processes.
          </Body>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">Break / Shatter</p>
              <StaticDynamicSlider
                staticSrc={withBase("design_space_static/shatter.png")}
                dynamicSrc={withBase("videos/shatter.gif")}
                aspectRatio="1000/648"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground">Fold / Unfold</p>
              <StaticDynamicSlider
                staticSrc={withBase("design_space_static/fold.png")}
                dynamicSrc={withBase("videos/fold.gif")}
                aspectRatio="1000/648"
              />
            </div>
          </div>
        </Section>

        {/* Spatial arrangement */}
        <Section>
          <SectionTitle>Spatial arrangement</SectionTitle>
          <Body>
            Spatial arrangement describes how multiple elements are repeated, distributed, and organized in space. In our design space, it is part of the group and population attributes and applies mainly to collections rather than individual marks. We distinguish patterns such as alignment, stacking, piling, geographical placement, scattering, clustering, topological arrangement, and trajectory. In physically-inspired visualizations, these arrangements often go beyond conventional layout: they can suggest physical organization, movement, accumulation, or environmental context, and therefore shape how data is structured and interpreted.
          </Body>
          <div style={{ width: "fit-content" }}>
            <SpatialArrangementPanel
              cards={groupCards}
              dimensionColor={groupColor}
              categoryIcon={groupIcon}
              corpusById={corpusById}
            />
          </div>
        </Section>

        {/* Implied physical mechanisms */}
        <Section>
          <SectionTitle>Implied physical mechanisms</SectionTitle>
          <Body>
            Implied physical mechanisms capture the processes that a visualization seems to evoke. Physical attributes describe the visible effect, but mechanisms describe the cause a viewer may infer from it: the same size change, for instance, can feel like growth, decay, inflation, or accumulation. We group these mechanisms into broad biological and physics-based or chemical families, which helps show how physically-inspired visualizations do more than borrow a look from the physical world — they also borrow its processes, transformations, and logic of change.
          </Body>
          <div className="grid grid-cols-3 gap-6">
            {mechanismCards.map(card => (
              <FlippableCard
                key={card.id}
                card={card}
                categoryIcon={mechanismIcon}
                dimensionColor={mechanismColor}
                isMechanism
                corpusById={corpusById}
              />
            ))}
          </div>
        </Section>

        {/* Explore buttons */}
        <Section>
          <SectionTitle>Explore the project</SectionTitle>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => onTabChange?.("design-space")}
              className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Explore the Design Space →
            </button>
            <button
              onClick={() => onTabChange?.("corpus")}
              className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Browse the Corpus →
            </button>
            <button
              onClick={() => onTabChange?.("coding-interface")}
              className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Open Coding Interface →
            </button>
          </div>
        </Section>

      </div>
    </div>
  );
}
