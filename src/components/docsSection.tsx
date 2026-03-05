import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { API_ROWS, OVERRIDE_ROWS, PRESETS } from "../config/constants";
import { BORDER, DARK, LIGHT, MID, MONO } from "../styles/theme";

export function DocsSection() {
  return (
    <View style={styles.docs}>
      <Text style={styles.docsTitle}>Docs</Text>

      <DocBlock title="Installation">
        <CodeBlock code="npm install wave-loader @shopify/react-native-skia" />
        <Text style={styles.bodyText}>
          Peer dependencies: react {">="} 18, react-native {">="} 0.73,
          @shopify/react-native-skia ^2.0.0
        </Text>
      </DocBlock>

      <DocBlock title="Basic usage">
        <CodeBlock
          code={`import { WaveLoader } from "wave-loader";

export function MyLoader() {
  return <WaveLoader width={240} height={80} />;
}`}
        />
      </DocBlock>

      <DocBlock title="Per-wave overrides">
        <CodeBlock
          code={`<WaveLoader
  waves={4}
  color="#1F6FEB"
  durationMs={4200}
  pathVariant="smooth"
  waveOverrides={[
    { color: "#0A3D62", durationMs: 4600 },
    { color: "#00B4D8", pathVariant: "choppy" },
    { color: "#06D6A0", pathVariant: "smooth" },
    { color: "#48CAE4" },
  ]}
/>`}
        />
      </DocBlock>

      <DocBlock title="WaveLoaderProps">
        <View style={styles.table}>
          <TableHeader />
          {API_ROWS.map((row) => (
            <ApiTableRow
              key={row.name}
              name={row.name}
              type={row.type}
              defaultValue={row.defaultValue}
              description={row.description}
            />
          ))}
        </View>
      </DocBlock>

      <DocBlock title="WaveLoaderWaveOverride">
        <View style={styles.table}>
          <TableHeader />
          {OVERRIDE_ROWS.map((row) => (
            <ApiTableRow
              key={row.name}
              name={row.name}
              type={row.type}
              defaultValue={row.defaultValue}
              description={row.description}
            />
          ))}
        </View>
      </DocBlock>

      <DocBlock title="Presets">
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>
            {`import { WaveLoader, auroraPreset } from "wave-loader";\n\n<WaveLoader {...auroraPreset} />`}
          </Text>
        </View>
        <Text style={styles.bodyText}>
          Ready-made configurations you can spread into WaveLoader:
        </Text>
        <Text style={[styles.bodyText]}>
          {PRESETS.filter((p) => p.id !== "mahalo")
            .map((p) => p.id)
            .join(", ")}
        </Text>
      </DocBlock>
    </View>
  );
}

function DocBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.docBlock}>
      <Text style={styles.docBlockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <View style={styles.codeBox}>
      <Text selectable style={styles.codeText}>
        {code}
      </Text>
    </View>
  );
}

function TableHeader() {
  return (
    <View style={[styles.tableRow, styles.tableHead]}>
      <Text style={[styles.tableHeadCell, styles.cellName]}>Name</Text>
      <Text style={[styles.tableHeadCell, styles.cellType]}>Type</Text>
      <Text style={[styles.tableHeadCell, styles.cellDefault]}>Default</Text>
      <Text style={[styles.tableHeadCell, styles.cellDesc]}>Description</Text>
    </View>
  );
}

function ApiTableRow({
  name,
  type,
  defaultValue,
  description,
}: {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}) {
  return (
    <View style={styles.tableRow}>
      <Text
        selectable
        style={[styles.tableCell, styles.tableCellMono, styles.cellName]}
      >
        {name}
      </Text>
      <Text
        selectable
        style={[styles.tableCell, styles.tableCellMono, styles.cellType]}
      >
        {type}
      </Text>
      <Text
        selectable
        style={[styles.tableCell, styles.tableCellMono, styles.cellDefault]}
      >
        {defaultValue}
      </Text>
      <Text style={[styles.tableCell, styles.cellDesc]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  docs: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  docsTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 28,
  },
  docBlock: {
    borderTopColor: DARK,
    paddingTop: 20,
    marginBottom: 28,
  },
  docBlockTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  bodyText: {
    color: MID,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  codeBox: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    backgroundColor: LIGHT,
  },
  codeText: {
    color: DARK,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: MONO,
  },
  table: {
    borderTopWidth: 0,
  },
  tableHead: {
    backgroundColor: "transparent",
    borderBottomColor: DARK,
  },
  tableHeadCell: {
    color: DARK,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableCell: {
    color: MID,
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 8,
    lineHeight: 18,
  },
  tableCellMono: {
    fontFamily: MONO,
    color: DARK,
  },
  cellName: {
    flex: 1.3,
  },
  cellType: {
    flex: 2,
  },
  cellDefault: {
    flex: 1.8,
  },
  cellDesc: {
    flex: 2.8,
  },
  presetDocRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  presetDocName: {
    color: DARK,
    fontSize: 13,
    fontWeight: "600",
  },
  presetDocDesc: {
    color: MID,
    fontSize: 13,
  },
});
