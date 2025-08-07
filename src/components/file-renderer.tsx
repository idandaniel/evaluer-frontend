import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface FileRendererProps {
    file: {
        name: string;
        content: string;
        mime_type?: string;
        size?: number;
    };
    className?: string;
}

interface FileTypeRenderer {
    canRender: (mimeType: string) => boolean;
    render: (file: FileRendererProps['file']) => React.ReactNode;
}

const createDataUrl = (mimeType: string, content: string) => 
    `data:${mimeType};base64,${content}`;

const DownloadButton = ({ file, variant = "default", size = "sm" }: {
    file: FileRendererProps['file'];
    variant?: "default" | "outline" | "secondary";
    size?: "sm" | "default";
}) => (
    <Button
        variant={variant}
        size={size}
        asChild
    >
        <a
            href={createDataUrl(file.mime_type || 'application/octet-stream', file.content)}
            download={file.name}
            className="inline-flex items-center gap-2"
        >
            📥 Download {file.name}
        </a>
    </Button>
);

const FileContainer = ({ children, className }: { 
    children: React.ReactNode; 
    className?: string; 
}) => (
    <div className={cn("p-4 bg-slate-50 border rounded-md", className)}>
        {children}
    </div>
);

const textRenderer: FileTypeRenderer = {
    canRender: (mimeType: string) => 
        mimeType.startsWith('text/') || 
        mimeType.includes('json') || 
        mimeType.includes('xml') ||
        mimeType.includes('javascript') ||
        mimeType.includes('typescript'),
    
    render: (file) => (
        <FileContainer>
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed overflow-auto max-h-96 text-slate-800">
                {file.content}
            </pre>
        </FileContainer>
    )
};

const imageRenderer: FileTypeRenderer = {
    canRender: (mimeType: string) => mimeType.startsWith('image/'),
    
    render: (file) => (
        <FileContainer className="text-center">
            <img 
                src={createDataUrl(file.mime_type!, file.content)}
                alt={file.name}
                className="max-w-full h-auto max-h-96 mx-auto rounded border"
            />
        </FileContainer>
    )
};

const pdfRenderer: FileTypeRenderer = {
    canRender: (mimeType: string) => mimeType === 'application/pdf',
    
    render: (file) => (
        <FileContainer>
            <div className="mb-3">
                <DownloadButton file={file} variant="outline" />
            </div>
            <iframe 
                src={createDataUrl(file.mime_type!, file.content)}
                className="w-full h-96 border rounded"
                title={file.name}
            />
        </FileContainer>
    )
};

const fallbackRenderer: FileTypeRenderer = {
    canRender: () => true,
    
    render: (file) => (
        <FileContainer className="text-center">
            <div className="text-slate-600 mb-3">
                This file type ({file.mime_type || 'unknown'}) cannot be displayed directly.
            </div>
            <DownloadButton file={file} />
        </FileContainer>
    )
};

const errorRenderer = (file: FileRendererProps['file'], error?: string) => (
    <FileContainer className="border-red-200 bg-red-50">
        <Alert variant="destructive" className="mb-3">
            <AlertDescription>
                {error || "Error processing file content"}
            </AlertDescription>
        </Alert>
        <DownloadButton file={file} variant="outline" />
    </FileContainer>
);

const FILE_RENDERERS: Array<FileTypeRenderer> = [
    textRenderer,
    imageRenderer,
    pdfRenderer,
    fallbackRenderer
];

const findRenderer = (mimeType: string): FileTypeRenderer => {
    return FILE_RENDERERS.find(renderer => renderer.canRender(mimeType)) || fallbackRenderer;
};

export const FileRenderer = ({ file, className }: FileRendererProps) => {
    if (!file.content) {
        return errorRenderer(file, "No content available");
    }

    try {
        const renderer = findRenderer(file.mime_type || '');
        return (
            <div className={className}>
                {renderer.render(file)}
            </div>
        );
    } catch (error) {
        console.error('File rendering error:', error);
        return errorRenderer(file);
    }
};
