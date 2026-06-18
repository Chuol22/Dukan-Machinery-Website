import { machinesData } from '../data/machinesData';
import { MappingAnalyzer } from '../lib/services/video/analyzers';

const analyzer = new MappingAnalyzer();
const result = analyzer.generateMappingReport(machinesData);
console.log('=== Mapping Analysis ===');
console.log(`Total machines: ${result.totalMachines}`);
console.log(`Unique URLs: ${result.uniqueUrls}`);
console.log(`Duplicates: ${result.duplicates.length}`);
console.log(`Mismatches: ${result.mismatches.length}`);
if (result.duplicates.length > 0) {
  console.log('DUPLICATES:', JSON.stringify(result.duplicates, null, 2));
}
if (result.mismatches.length > 0) {
  console.log('MISMATCHES:', JSON.stringify(result.mismatches, null, 2));
}
