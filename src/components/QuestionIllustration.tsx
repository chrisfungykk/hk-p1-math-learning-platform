/** Renders an inline SVG illustration string safely via dangerouslySetInnerHTML. */
export default function QuestionIllustration({ svg }: { svg: string }) {
  return (
    <div
      className="inline-block my-1"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
