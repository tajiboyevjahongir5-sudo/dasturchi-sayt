'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Trash2, 
  Edit3, 
  Terminal, 
  Eye, 
  AlertTriangle, 
  Layers, 
  FileCode,
  FolderOpen,
  Code2,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MultiFileEditor, ProjectFileName } from '@/components/editor/MultiFileEditor';
import { MultiFilePreview, ConsoleEntry } from '@/components/editor/MultiFilePreview';
import { ConsoleOutput } from '@/components/editor/ConsoleOutput';
import { ErrorExplanationPanel } from '@/components/editor/ErrorExplanationPanel';
import { RobotCompanion } from '@/components/companion/RobotCompanion';
import { explainError } from '@/lib/error-explainer';
import { useToast } from '@/components/providers/ToastProvider';
import type { UserProject, ErrorExplanation, CodeError } from '@/types';

const DEFAULT_PROJECT = {
  title: 'Mening Yangi Veb Loyiham',
  html: `<div class="card">
  <h1>Salom, CodeQuest!</h1>
  <p>Bu yerda HTML, CSS va JavaScript birgalikda ishlaydi.</p>
  <button id="counterBtn" class="btn">Bosishlar: 0</button>
</div>`,
  css: `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  margin: 0;
}

.card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 420px;
}

h1 {
  font-size: 22px;
  margin-bottom: 8px;
  color: #60a5fa;
}

p {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.6;
}

.btn {
  background: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}`,
  js: `// Tugma elementini topamiz
const btn = document.getElementById('counterBtn');
let count = 0;

console.log("Loyiha ishga tushdi! Tugmani bosing.");

if (btn) {
  btn.addEventListener('click', () => {
    count++;
    btn.textContent = 'Bosishlar: ' + count;
    console.log('Tugma bosildi. Yangi hisob:', count);
  });
}`,
};

export default function WorkspacePage() {
  const { toast } = useToast();

  // Project state
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [currentProject, setCurrentProject] = useState<UserProject | null>(null);
  const [files, setFiles] = useState<{
    'index.html': string;
    'style.css': string;
    'script.js': string;
  }>({
    'index.html': DEFAULT_PROJECT.html,
    'style.css': DEFAULT_PROJECT.css,
    'script.js': DEFAULT_PROJECT.js,
  });

  // Project ref tracking to avoid race conditions
  const currentProjectRef = useRef<UserProject | null>(null);
  const filesRef = useRef(files);

  useEffect(() => {
    currentProjectRef.current = currentProject;
  }, [currentProject]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Editor & Autosave state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'idle'>('saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState<'editor' | 'preview'>('editor');

  // Execution & Diagnostics state
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'error'>('preview');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [codeErrors, setCodeErrors] = useState<CodeError[]>([]);
  const [errorDiagnosis, setErrorDiagnosis] = useState<ErrorExplanation | null>(null);

  // Modals state
  const [isProjectsListOpen, setIsProjectsListOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Autosave & race-condition guards
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveInProgressRef = useRef(false);
  const pendingSaveFilesRef = useRef<typeof files | null>(null);

  // 1. Load user projects on initial mount
  useEffect(() => {
    let ignore = false;
    async function loadInitialProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const json = await res.json();
          if (!ignore && json.success && json.data) {
            setProjects(json.data);
            if (json.data.length > 0) {
              const first = json.data[0];
              setCurrentProject(first);
              setFiles({
                'index.html': first.html,
                'style.css': first.css,
                'script.js': first.js,
              });
              setSaveStatus('saved');
            }
          }
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
      }
    }
    loadInitialProjects();
    return () => {
      ignore = true;
    };
  }, []);

  // 2. Save Project (Manual or Autosave)
  const saveProject = async (filesToSave?: typeof files, titleToSave?: string) => {
    const targetFiles = filesToSave || filesRef.current;
    if (saveInProgressRef.current) {
      pendingSaveFilesRef.current = targetFiles;
      return;
    }

    saveInProgressRef.current = true;
    setSaveStatus('saving');

    try {
      const activeProj = currentProjectRef.current;
      if (activeProj) {
        // PUT update existing project
        const res = await fetch(`/api/projects/${activeProj.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: titleToSave || activeProj.title,
            html: targetFiles['index.html'],
            css: targetFiles['style.css'],
            js: targetFiles['script.js'],
          }),
        });

        if (!res.ok) throw new Error('Save failed');
        const json = await res.json();
        if (json.success) {
          setCurrentProject(json.data);
          setProjects((prev) => prev.map((p) => (p.id === json.data.id ? json.data : p)));
          setHasUnsavedChanges(false);
          setSaveStatus('saved');
        } else {
          throw new Error(json.error);
        }
      } else {
        // POST create new project
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: titleToSave || DEFAULT_PROJECT.title,
            html: targetFiles['index.html'],
            css: targetFiles['style.css'],
            js: targetFiles['script.js'],
          }),
        });

        if (!res.ok) throw new Error('Create failed');
        const json = await res.json();
        if (json.success) {
          setCurrentProject(json.data);
          setProjects((prev) => [json.data, ...prev]);
          setHasUnsavedChanges(false);
          setSaveStatus('saved');
        } else {
          throw new Error(json.error);
        }
      }
    } catch (err: unknown) {
      console.error('Save error:', err);
      setSaveStatus('error');
    } finally {
      saveInProgressRef.current = false;
      // If changes occurred during save, trigger pending save
      if (pendingSaveFilesRef.current) {
        const nextFiles = pendingSaveFilesRef.current;
        pendingSaveFilesRef.current = null;
        saveProject(nextFiles);
      }
    }
  };

  // 3. File Change Handler with Debounced Autosave (1.5s)
  const handleFileChange = (fileName: ProjectFileName, value: string) => {
    const updated = {
      ...files,
      [fileName]: value,
    };
    setFiles(updated);
    setHasUnsavedChanges(true);
    setSaveStatus('saving');

    // Debounced autosave
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(() => {
      saveProject(updated);
    }, 1500);
  };

  // 4. Handle incoming console messages from sandbox iframe
  const handleConsoleMessage = (entry: ConsoleEntry) => {
    setConsoleLogs((prev) => [
      ...prev,
      `[${entry.time}] ${entry.level.toUpperCase()}: ${entry.message}`,
    ]);

    if (entry.level === 'error') {
      const diag = explainError(entry.message, entry.line);
      setErrorDiagnosis(diag);
      setCodeErrors((prev) => [
        ...prev,
        {
          type: 'runtime',
          message: entry.message,
          line: entry.line,
          originalMessage: entry.message,
        },
      ]);
      setActiveTab('error');
    }
  };

  // 5. Run / Refresh project
  const handleRun = () => {
    setIsRunning(true);
    setConsoleLogs([]);
    setCodeErrors([]);
    setErrorDiagnosis(null);
    setActiveTab('preview');
    setMobileWorkspaceTab('preview');
    saveProject();

    toast({
      title: 'Loyiha yangilandi!',
      description: 'HTML, CSS va JS kodingiz sandboxed iframe ichida ishga tushirildi.',
      variant: 'default',
    });

    setTimeout(() => {
      setIsRunning(false);
    }, 400);
  };

  // 6. Reset to default template
  const handleReset = () => {
    if (confirm('Loyihani boshlang‘ich shablonga qaytarishni tasdiqlaysizmi? Hozirgi o‘zgarishlar bekor qilinadi.')) {
      const resetFiles = {
        'index.html': DEFAULT_PROJECT.html,
        'style.css': DEFAULT_PROJECT.css,
        'script.js': DEFAULT_PROJECT.js,
      };
      setFiles(resetFiles);
      saveProject(resetFiles);
      setConsoleLogs([]);
      setErrorDiagnosis(null);
      toast({
        title: 'Shablon tiklandi',
        description: 'Boshlang‘ich loyiha kodi yuklandi.',
        variant: 'default',
      });
    }
  };

  // 7. Create New Project
  const handleCreateNewProject = async () => {
    if (hasUnsavedChanges) {
      if (!confirm('Saqlanmagan o‘zgarishlar bor. Baribir yangi loyiha ochasizmi?')) return;
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Loyiha #${projects.length + 1}`,
          html: DEFAULT_PROJECT.html,
          css: DEFAULT_PROJECT.css,
          js: DEFAULT_PROJECT.js,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setProjects((prev) => [json.data, ...prev]);
        setCurrentProject(json.data);
        setFiles({
          'index.html': json.data.html,
          'style.css': json.data.css,
          'script.js': json.data.js,
        });
        setHasUnsavedChanges(false);
        setSaveStatus('saved');
        setIsProjectsListOpen(false);
        toast({
          title: 'Yangi loyiha yaratildi!',
          description: `"${json.data.title}" muvaffaqiyatli ochildi.`,
          variant: 'success',
        });
      } else {
        toast({
          title: 'Xatolik',
          description: json.error,
          variant: 'error',
        });
      }
    } catch {
      toast({
        title: 'Xatolik',
        description: 'Yangi loyiha yaratib bo‘lmadi.',
        variant: 'error',
      });
    }
  };

  // 8. Open existing project
  const handleOpenProject = (p: UserProject) => {
    if (hasUnsavedChanges) {
      if (!confirm('Saqlanmagan o‘zgarishlar bor. Boshqa loyihaga o‘tishni tasdiqlaysizmi?')) return;
    }
    setCurrentProject(p);
    setFiles({
      'index.html': p.html,
      'style.css': p.css,
      'script.js': p.js,
    });
    setHasUnsavedChanges(false);
    setSaveStatus('saved');
    setConsoleLogs([]);
    setErrorDiagnosis(null);
    setIsProjectsListOpen(false);
  };

  // 9. Rename Project
  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !newTitle.trim()) return;

    try {
      const res = await fetch(`/api/projects/${currentProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      const json = await res.json();
      if (json.success) {
        setCurrentProject(json.data);
        setProjects((prev) => prev.map((p) => (p.id === json.data.id ? json.data : p)));
        setIsRenameOpen(false);
        toast({
          title: 'Nom yangilandi',
          description: `Yangi nom: "${json.data.title}"`,
          variant: 'success',
        });
      }
    } catch {
      toast({ title: 'Xatolik', description: 'Nomni yangilab bo‘lmadi', variant: 'error' });
    }
  };

  // 10. Delete Project
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      const res = await fetch(`/api/projects/${projectToDelete}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        const remaining = projects.filter((p) => p.id !== projectToDelete);
        setProjects(remaining);
        if (currentProject?.id === projectToDelete) {
          if (remaining.length > 0) {
            handleOpenProject(remaining[0]);
          } else {
            setCurrentProject(null);
            setFiles({
              'index.html': DEFAULT_PROJECT.html,
              'style.css': DEFAULT_PROJECT.css,
              'script.js': DEFAULT_PROJECT.js,
            });
          }
        }
        setIsDeleteConfirmOpen(false);
        setProjectToDelete(null);
        toast({
          title: 'Loyiha o‘chirildi',
          description: 'Loyiha butunlay olib tashlandi.',
          variant: 'default',
        });
      }
    } catch {
      toast({ title: 'Xatolik', description: 'Loyihani o‘chirib bo‘lmadi', variant: 'error' });
    }
  };

  return (
    <div className="space-y-4 pb-16 max-w-7xl mx-auto">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Layers className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-foreground line-clamp-1">
                {currentProject ? currentProject.title : 'Web Project Workspace'}
              </h1>
              {currentProject && (
                <button
                  type="button"
                  onClick={() => {
                    setNewTitle(currentProject.title);
                    setIsRenameOpen(true);
                  }}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  title="Nomini o‘zgartirish"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>HTML, CSS va JavaScript interaktiv muhiti</span>
              {hasUnsavedChanges && (
                <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
                  • Saqlanmagan o‘zgarishlar
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Project Manager Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setIsProjectsListOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5"
          >
            <FolderOpen className="w-3.5 h-3.5 text-primary" />
            <span>Loyihalarim ({projects.length})</span>
          </Button>

          <Button
            type="button"
            onClick={handleCreateNewProject}
            variant="gradient"
            size="sm"
            className="text-xs font-bold gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yangi loyiha</span>
          </Button>
        </div>
      </div>

      {/* Mobile Mode Switcher (Visible only on < lg) */}
      <div className="lg:hidden sticky top-16 z-30 bg-background/95 backdrop-blur-md border border-border/80 rounded-xl p-1 shadow-sm flex items-center gap-1">
        <button
          type="button"
          onClick={() => setMobileWorkspaceTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
            mobileWorkspaceTab === 'editor'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>1. Kod Muharriri</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileWorkspaceTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
            mobileWorkspaceTab === 'preview'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>2. Jonli Natija</span>
          {consoleLogs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-primary-foreground/20 text-[10px] font-bold">
              {consoleLogs.length}
            </span>
          )}
        </button>
      </div>

      {/* 2. Main Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Multi-file Editor */}
        <div className={`lg:col-span-6 xl:col-span-7 space-y-4 ${mobileWorkspaceTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
          <MultiFileEditor
            files={files}
            onChange={handleFileChange}
            onRun={handleRun}
            onSave={() => saveProject()}
            onReset={handleReset}
            isLoading={isRunning}
            saveStatus={saveStatus}
            height="520px"
          />
        </div>

        {/* Right Column: Sandbox Preview & Diagnostics Tabs */}
        <div className={`lg:col-span-6 xl:col-span-5 flex flex-col space-y-3 ${mobileWorkspaceTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Mobile Back-to-Editor Banner */}
          <div className="lg:hidden flex items-center justify-between bg-muted/50 border border-border/70 rounded-xl px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium">Jonli natija rejimi</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMobileWorkspaceTab('editor')}
              className="h-7 text-xs font-bold gap-1 text-primary hover:text-primary/90 px-2.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kodni tahrirlash</span>
            </Button>
          </div>

          {/* Sub-tabs header */}
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>Jonli Natija</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'console'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Konsol</span>
                {consoleLogs.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                    {consoleLogs.length}
                  </span>
                )}
              </button>

              {errorDiagnosis && (
                <button
                  type="button"
                  onClick={() => setActiveTab('error')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'error'
                      ? 'bg-background text-red-500 shadow-xs'
                      : 'text-red-400 hover:text-red-500'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  <span>Xato Tahlili</span>
                </button>
              )}
            </div>

            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Sandbox izolyatsiyasi faol
            </span>
          </div>

          {/* Active View Container */}
          <div className="flex-1 min-h-[500px]">
            {activeTab === 'preview' && (
              <MultiFilePreview
                files={files}
                onConsoleMessage={handleConsoleMessage}
                className="h-full min-h-[500px]"
              />
            )}

            {activeTab === 'console' && (
              <div className="h-full min-h-[500px]">
                <ConsoleOutput
                  output={consoleLogs.join('\n')}
                  errors={codeErrors}
                  onClear={() => {
                    setConsoleLogs([]);
                    setCodeErrors([]);
                    setErrorDiagnosis(null);
                  }}
                />
              </div>
            )}

            {activeTab === 'error' && errorDiagnosis && (
              <div className="space-y-4">
                <ErrorExplanationPanel
                  explanation={errorDiagnosis}
                  onRetry={handleRun}
                />
                <Button
                  onClick={() => setActiveTab('preview')}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Jonli natijaga qaytish
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Project Manager Dialog */}
      <Dialog open={isProjectsListOpen} onOpenChange={setIsProjectsListOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-primary" />
              <span>Mening Veb Loyihalarim</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {projects.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <FileCode className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold">Hozircha saqlangan loyihalar yo‘q</p>
                <Button onClick={handleCreateNewProject} variant="gradient" size="sm">
                  Birinchi loyihani yaratish
                </Button>
              </div>
            ) : (
              projects.map((p) => {
                const isCurrent = currentProject?.id === p.id;
                return (
                  <Card
                    key={p.id}
                    className={`p-4 transition-all flex items-center justify-between gap-3 ${
                      isCurrent ? 'border-primary/60 bg-primary/5' : 'hover:border-border/80'
                    }`}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground truncate">{p.title}</h4>
                        {isCurrent && (
                          <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                            Faol
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Yangilandi: {new Date(p.updatedAt).toLocaleDateString('uz-UZ')} {new Date(p.updatedAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isCurrent && (
                        <Button
                          onClick={() => handleOpenProject(p)}
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold"
                        >
                          Ochish
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setProjectToDelete(p.id);
                          setIsDeleteConfirmOpen(true);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          <DialogFooter className="border-t border-border pt-3">
            <Button onClick={handleCreateNewProject} variant="gradient" size="sm" className="gap-1.5 font-bold">
              <Plus className="w-4 h-4" />
              <span>Yangi loyiha qo‘shish</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Rename Project Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loyiha nomini o‘zgartirish</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRenameSubmit} className="space-y-4 py-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Loyiha nomi..."
              maxLength={100}
              required
              autoFocus
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRenameOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" variant="gradient">
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 5. Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Loyihani o‘chirish</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Haqiqatan ham bu loyihani o‘chirmoqchimisiz? Ushbu amalni qaytarib bo‘lmaydi.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              O‘chirishni tasdiqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Robo-Ustoz: Natural Human Uzbek Speech & Interactive Floating Companion */}
      <RobotCompanion
        lessonTitle={currentProject ? currentProject.title : 'Web Workspace Loyihasi'}
        lessonObjective="HTML, CSS va JavaScript yordamida interaktiv veb ilova yaratish"
        lastError={codeErrors.length > 0 ? codeErrors[0] : null}
        userCode={files['script.js']}
      />
    </div>
  );
}
