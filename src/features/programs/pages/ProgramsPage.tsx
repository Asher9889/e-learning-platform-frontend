import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import { usePrograms } from "../hooks/usePrograms";
import { HeroSection } from "../components/HeroSection";
import { ProgramFilters } from "../components/ProgramFilters";
import { ProgramStats } from "../components/ProgramStats";
import { FeaturedPrograms } from "../components/FeaturedPrograms";
import { ProgramGrid } from "../components/ProgramGrid";
import { ProgramFAQ } from "../components/ProgramFAQ";
import { CTASection } from "../components/CTASection";
import { ApplyNowModal } from "../components/ApplyNowModal";
import type { Program } from "../types/program.types";

export default function ProgramsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Programs");
  const [durationFilter, setDurationFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { programs, featured, isLoading } = usePrograms({
    searchQuery,
    categoryFilter,
    durationFilter,
    sortBy,
  });

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("All Programs");
    setDurationFilter("All");
    setSortBy("Newest");
  }, []);

  const handleViewDetails = useCallback(
    (slug: string) => {
      navigate(`/programs/${slug}`);
    },
    [navigate]
  );

  const handleApplyNow = useCallback((program: Program) => {
    setSelectedProgram(program);
    setModalOpen(true);
  }, []);

  const handleBrowsePrograms = useCallback(() => {
    const el = document.getElementById("programs-grid");
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleContactAdmissions = useCallback(() => {
    sileo.success({
      title: "Contact admissions flow will be integrated soon.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onBrowsePrograms={handleBrowsePrograms}
        onContactAdmissions={handleContactAdmissions}
      />
      <ProgramStats />
      <ProgramFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        durationFilter={durationFilter}
        onDurationChange={setDurationFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={resetFilters}
      />
      <FeaturedPrograms
        programs={featured}
        onViewDetails={handleViewDetails}
        onApplyNow={handleApplyNow}
      />
      <div id="programs-grid">
        <ProgramGrid
          programs={programs}
          onViewDetails={handleViewDetails}
          onApplyNow={handleApplyNow}
          onResetFilters={resetFilters}
          isLoading={isLoading}
        />
      </div>
      <ProgramFAQ />
      <CTASection
        onApplyNow={() => handleApplyNow(programs[0])}
        onContactAdmissions={handleContactAdmissions}
      />
      <ApplyNowModal
        program={selectedProgram}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
