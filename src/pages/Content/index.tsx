import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadContentDialog } from "@/features/content/components/UploadContentDialog";
import { ContentStatsCards } from "@/features/content/components/ContentStatsCards";
import { ContentFilters } from "@/features/content/components/ContentFilters";
import { PublishedGrid } from "@/features/content/components/PublishedGrid";
import { DraftsTable } from "@/features/content/components/DraftsTable";
import { TrashTable } from "@/features/content/components/TrashTable";
import { DraftMetadataDrawer } from "@/features/content/components/DraftMetadataDrawer";
import { PaginationBar } from "@/features/content/components/PaginationBar";
import { useGetPrograms } from "@/pages/Programs/hooks/useGetPrograms";
import { useGetSubjects } from "@/pages/Subjects/hooks/useGetSubjects";
import { useGetMaterials } from "@/features/content/hooks/useGetMaterials";
import { useMaterialsStats } from "@/features/content/hooks/useMaterialsStats";
import {
  useUpdateMaterial,
  usePublishMaterial,
  useDeleteMaterial,
  useRestoreMaterial,
} from "@/features/content/hooks/useContentMutations";
import type { Material, MaterialType } from "@/features/content/types/content.types";
import { PreviewModal } from "@/components/material-preview/PreviewModal";
import { getMaterialFileUrl } from "@/components/material-preview/MaterialPreview";
import { useAppSelector } from "@/store/hooks";
import type { IStudentRoleInfo } from "@/constants/user/user.constant";

export default function ContentPage() {
  const userData = useAppSelector((state) => state.auth.user);  
  const myRole = userData?.role;

  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("PUBLISHED");
  const [programId, setProgramId] = useState(userData ? (userData.roleInfo as IStudentRoleInfo)?.programId  : "");
  const [subjectId, setSubjectId] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [drawerMaterial, setDrawerMaterial] = useState<Material | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  const { data: programData } = useGetPrograms();
  const { data: subjectsData } = useGetSubjects(programId || undefined);
  const { data: materialsData, isLoading } = useGetMaterials({
    status: activeTab as "PUBLISHED" | "DRAFT" | "DELETED",
    programId: programId || undefined,
    subjectId: subjectId || undefined,
    type: (typeFilter !== "all" ? typeFilter : undefined) as MaterialType | undefined,
    search: search || undefined,
    page,
    limit,
  });
  const { data: statsData } = useMaterialsStats();
  const { mutate: updateMaterial } = useUpdateMaterial();
  const { mutate: publishMaterial } = usePublishMaterial();
  const { mutate: deleteMaterial } = useDeleteMaterial();
  const { mutate: restoreMaterial } = useRestoreMaterial();

  const programs = programData?.programs || [];
  const subjects = subjectsData?.subjects || [];
  const materials = materialsData?.data?.materials || [];
  const pagination = materialsData?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const hasFilters = !!(programId || subjectId || (typeFilter !== "all") || search);

  const clearFilters = useCallback(() => {
    setProgramId("");
    setSubjectId("");
    setTypeFilter("all");
    setSearch("");
    setPage(1);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setPage(1);
  }, []);

  const handleProgramChange = useCallback((v: string) => {
    setProgramId(v);
    setSubjectId("");
    setPage(1);
  }, []);

  const handleOpenDrawer = useCallback((material: Material) => {
    setDrawerMaterial(material);
    setDrawerOpen(true);
  }, []);

  const handleSaveDraft = useCallback(
    (id: string, data: { title: string; description?: string; programId?: string; subjectId?: string }) => {
      updateMaterial({ id, data });
    },
    [updateMaterial]
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all learning materials across programs and subjects.
          </p>
        </div>
        {myRole !== "STUDENT" &&   <Button className="gap-2" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Upload Content
        </Button>}
      </div>

      {myRole !== "STUDENT" &&  <ContentStatsCards stats={statsData?.data[0]} />}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
       {myRole !== "STUDENT" &&  <TabsList className="mb-4">
          <TabsTrigger value="PUBLISHED">Published</TabsTrigger>
          <TabsTrigger value="DRAFT">Drafts</TabsTrigger>
          <TabsTrigger value="DELETED">Trash</TabsTrigger>
        </TabsList>
    }

        {activeTab !== "DELETED" && (
          <div className="mb-4">
            <ContentFilters
              programId={programId}
              subjectId={subjectId}
              type={typeFilter}
              search={search}
              programs={programs}
              subjects={subjects}
              onProgramChange={handleProgramChange}
              onSubjectChange={(v) => { setSubjectId(v); setPage(1); }}
              onTypeChange={(v) => { setTypeFilter(v); setPage(1); }}
              onSearchChange={(v) => { setSearch(v); setPage(1); }}
              onClear={clearFilters}
              isVisible={myRole !== "STUDENT"}
            />
          </div>
        )}

        <TabsContent value="PUBLISHED" className="mt-0">
          <PublishedGrid
            materials={materials}
            isLoading={isLoading}
            hasFilters={hasFilters}
            onEdit={handleOpenDrawer}
            onPreview={setPreviewMaterial}
          />
        </TabsContent>

        <TabsContent value="DRAFT" className="mt-0">
          <DraftsTable
            materials={materials}
            isLoading={isLoading}
            onCompleteDetails={handleOpenDrawer}
          />
        </TabsContent>

        <TabsContent value="DELETED" className="mt-0">
          <TrashTable
            materials={materials}
            isLoading={isLoading}
            onRestore={(id) => restoreMaterial(id)}
            onPermanentDelete={(id) => deleteMaterial(id)}
          />
        </TabsContent>

        {materials.length > 0 && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            limit={limit}
            total={pagination?.total || 0}
            onPageChange={setPage}
            onLimitChange={(v) => { setLimit(Number(v)); setPage(1); }}
          />
        )}
      </Tabs>

      <UploadContentDialog open={uploadOpen} onOpenChange={setUploadOpen} />

      <DraftMetadataDrawer
        material={drawerMaterial}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        programs={programs}
        onSaveDraft={handleSaveDraft}
        onPublish={(id) => publishMaterial(id)}
        onDelete={(id) => deleteMaterial(id)}
      />

      <PreviewModal
        material={previewMaterial}
        fileUrl={previewMaterial ? getMaterialFileUrl(previewMaterial.objectKey) : ""}
        open={!!previewMaterial}
        onOpenChange={(open) => { if (!open) setPreviewMaterial(null) }}
      />
    </div>
  );
}
