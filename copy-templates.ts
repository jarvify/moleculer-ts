/**
 * Copies mustache templates from src/ to dist/
 */
import { cp } from 'shelljs';

cp('-R', 'src/templates', 'dist/templates');
