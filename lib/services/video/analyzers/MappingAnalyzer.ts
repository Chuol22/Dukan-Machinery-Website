// MappingAnalyzer.ts — Service for analyzing machine-video URL mappings
// Detects duplicate URLs and slug/filename mismatches across machine catalog

import { Machine } from '@/data/machinesData';
import { IMappingAnalyzer } from '../interfaces';
import { MappingAnalysisResult } from '../types';
import { DEBUG_LABELS } from '../constants';

export class MappingAnalyzer implements IMappingAnalyzer {
  /**
   * Analyzes machine-to-video mappings for uniqueness and correctness.
   * Detects duplicate URLs (multiple machines sharing the same video) and
   * mismatches where the video filename does not match the machine slug.
   */
  analyzeMappings(machines: Machine[]): MappingAnalysisResult {
    console.debug(`${DEBUG_LABELS.MAPPING_ANALYZER} Analyzing mappings for ${machines.length} machines`);

    // --- Duplicate detection ---
    // Build a map from URL → list of machines that reference it
    const urlToMachines = new Map<string, Machine[]>();

    for (const machine of machines) {
      const url = machine.image;
      if (!url) continue;

      const existing = urlToMachines.get(url) ?? [];
      existing.push(machine);
      urlToMachines.set(url, existing);
    }

    const duplicates: MappingAnalysisResult['duplicates'] = [];
    let uniqueUrls = 0;

    for (const [url, machineList] of urlToMachines.entries()) {
      uniqueUrls++;
      if (machineList.length > 1) {
        duplicates.push({
          url,
          machineIds: machineList.map(m => m.id),
          machineNames: machineList.map(m => m.name),
        });
      }
    }

    // --- Mismatch detection ---
    const mismatches: MappingAnalysisResult['mismatches'] = [];

    for (const machine of machines) {
      const url = machine.image;
      if (!url) continue;

      const videoFilename = this.extractVideoFilename(url);
      if (!videoFilename) continue;

      if (!this.validateFilenameMatch(machine.slug, videoFilename)) {
        mismatches.push({
          machineId: machine.id,
          machineName: machine.name,
          slug: machine.slug,
          videoFilename,
          expectedFilename: machine.slug,
        });
      }
    }

    console.debug(
      `${DEBUG_LABELS.MAPPING_ANALYZER} Analysis complete: ${uniqueUrls} unique URLs, ` +
      `${duplicates.length} duplicates, ${mismatches.length} mismatches`
    );

    return {
      totalMachines: machines.length,
      uniqueUrls,
      duplicates,
      mismatches,
    };
  }

  /**
   * Extracts the video filename (without extension) from a Cloudinary URL.
   *
   * Example:
   *   Input:  "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640342/dkm/machines/videos/banana-stem-fiber-extraction-machine.mp4"
   *   Output: "banana-stem-fiber-extraction-machine"
   *
   * Returns an empty string when the URL does not contain a recognisable filename.
   */
  extractVideoFilename(url: string): string {
    if (!url) return '';

    try {
      // Match the last path segment and strip the file extension
      const match = url.match(/\/([^\/]+)\.(mp4|webm)(?:[?#]|$)/i);
      return match ? match[1] : '';
    } catch {
      return '';
    }
  }

  /**
   * Checks whether a video filename matches the machine slug.
   * Comparison is normalised to lower-case so minor casing differences are ignored.
   */
  validateFilenameMatch(slug: string, filename: string): boolean {
    if (!slug || !filename) return false;
    return slug.toLowerCase() === filename.toLowerCase();
  }

  /**
   * Generates a comprehensive mapping analysis report.
   * Delegates to `analyzeMappings()` and returns the same result type.
   */
  generateMappingReport(machines: Machine[]): MappingAnalysisResult {
    console.debug(`${DEBUG_LABELS.MAPPING_ANALYZER} Generating mapping report`);
    return this.analyzeMappings(machines);
  }
}
