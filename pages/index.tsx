import React from "react";
import { Head } from "components/head";
import { Nav } from "components/nav";
import { MainContent } from "components/main-content";

const IndexPage = () => (
  <div className="flex flex-col min-h-screen">
    <Head
      title="Sudoku"
      description="Opinionated app for manually solving classic Sudoku puzzles"
    />
    <Nav />
    <MainContent />
  </div>
);

export default IndexPage;
