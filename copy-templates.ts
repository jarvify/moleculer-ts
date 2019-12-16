/**
 * Copies mustache templates from src/ to dist/
 */
import { cp } from 'shelljs';

cp('-rf', 'src/templates', 'dist');
