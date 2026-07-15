import { BookOpen, ExternalLink, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';

type Course = {
  name: string;
  category: 'Web' | 'Programming' | 'Database';
  level: string;
  summary: string;
  topics: string[];
  typingFocus: string;
  sourceKey: string;
  sourceUrl: string;
};

const courses: Course[] = [
  { name: 'HTML', category: 'Web', level: 'Beginner', summary: 'Build the structure and meaning of web pages with elements and attributes.', topics: ['Elements', 'Attributes', 'Links', 'Tables', 'Forms', 'Semantic HTML'], typingFocus: 'Angle brackets, closing tags, quotes, and indentation', sourceKey: 'html', sourceUrl: 'https://www.w3schools.com/html/' },
  { name: 'CSS', category: 'Web', level: 'Beginner', summary: 'Style page layouts, colors, spacing, typography, and responsive interfaces.', topics: ['Selectors', 'Box Model', 'Flexbox', 'Grid', 'Responsive Design', 'Animations'], typingFocus: 'Braces, colons, semicolons, class selectors, and units', sourceKey: 'css', sourceUrl: 'https://www.w3schools.com/css/' },
  { name: 'JavaScript', category: 'Web', level: 'Beginner to Advanced', summary: 'Add logic and interactivity to websites using variables, functions, objects, and events.', topics: ['Variables', 'Functions', 'Arrays', 'Objects', 'DOM', 'Async JavaScript'], typingFocus: 'Parentheses, braces, arrow functions, operators, and camelCase', sourceKey: 'js', sourceUrl: 'https://www.w3schools.com/js/' },
  { name: 'Python', category: 'Programming', level: 'Beginner', summary: 'Learn readable programming syntax for automation, data work, and web applications.', topics: ['Syntax', 'Data Types', 'Conditions', 'Loops', 'Functions', 'File Handling'], typingFocus: 'Indentation, colons, underscores, and snake_case', sourceKey: 'python', sourceUrl: 'https://www.w3schools.com/python/' },
  { name: 'SQL', category: 'Database', level: 'Beginner to Intermediate', summary: 'Store, retrieve, filter, join, and summarize structured data in relational databases.', topics: ['SELECT', 'WHERE', 'ORDER BY', 'INSERT', 'UPDATE', 'JOIN', 'GROUP BY'], typingFocus: 'Keywords, commas, parentheses, operators, and table names', sourceKey: 'sql', sourceUrl: 'https://www.w3schools.com/sql/' },
  { name: 'PHP', category: 'Web', level: 'Intermediate', summary: 'Create server-side web applications that process forms and work with databases.', topics: ['Syntax', 'Variables', 'Arrays', 'Functions', 'Forms', 'MySQL'], typingFocus: 'Dollar signs, arrows, brackets, quotes, and semicolons', sourceKey: 'php', sourceUrl: 'https://www.w3schools.com/php/' },
  { name: 'C++', category: 'Programming', level: 'Intermediate', summary: 'Practice a compiled language used for systems, applications, games, and algorithms.', topics: ['Variables', 'Conditions', 'Loops', 'Functions', 'Classes', 'References'], typingFocus: 'Scope operators, angle brackets, braces, pointers, and semicolons', sourceKey: 'cpp', sourceUrl: 'https://www.w3schools.com/cpp/' },
  { name: 'Java', category: 'Programming', level: 'Intermediate', summary: 'Learn object-oriented programming with strongly typed classes, methods, and collections.', topics: ['Syntax', 'Types', 'Methods', 'Classes', 'Inheritance', 'Collections'], typingFocus: 'Braces, parentheses, type names, camelCase, and semicolons', sourceKey: 'java', sourceUrl: 'https://www.w3schools.com/java/' },
];

const categories = ['All', 'Web', 'Programming', 'Database'] as const;

const learningCatalog = [
  { group: 'Web Development', items: [
    ['HTML', 'https://www.w3schools.com/html/'], ['CSS', 'https://www.w3schools.com/css/'], ['JavaScript', 'https://www.w3schools.com/js/'], ['TypeScript', 'https://www.w3schools.com/typescript/'], ['React', 'https://www.w3schools.com/react/'], ['Vue', 'https://www.w3schools.com/vue/'], ['Angular', 'https://www.w3schools.com/angular/'], ['AngularJS', 'https://www.w3schools.com/angularjs/'], ['jQuery', 'https://www.w3schools.com/jquery/'], ['Node.js', 'https://www.w3schools.com/nodejs/'], ['PHP', 'https://www.w3schools.com/php/'], ['Django', 'https://www.w3schools.com/django/'], ['ASP', 'https://www.w3schools.com/asp/'], ['JSON', 'https://www.w3schools.com/js/js_json_intro.asp'], ['XML', 'https://www.w3schools.com/xml/'],
  ]},
  { group: 'UI, CSS & Graphics', items: [
    ['W3.CSS', 'https://www.w3schools.com/w3css/'], ['Bootstrap', 'https://www.w3schools.com/bootstrap5/'], ['Sass', 'https://www.w3schools.com/sass/'], ['Responsive Web Design', 'https://www.w3schools.com/css/css_rwd_intro.asp'], ['SVG', 'https://www.w3schools.com/graphics/svg_intro.asp'], ['Canvas', 'https://www.w3schools.com/graphics/canvas_intro.asp'], ['HTML Colors', 'https://www.w3schools.com/colors/'], ['Icons', 'https://www.w3schools.com/icons/'], ['How To', 'https://www.w3schools.com/howto/'], ['Accessibility', 'https://www.w3schools.com/accessibility/'],
  ]},
  { group: 'Programming Languages', items: [
    ['Python', 'https://www.w3schools.com/python/'], ['Java', 'https://www.w3schools.com/java/'], ['C', 'https://www.w3schools.com/c/'], ['C++', 'https://www.w3schools.com/cpp/'], ['C#', 'https://www.w3schools.com/cs/'], ['R', 'https://www.w3schools.com/r/'], ['Go', 'https://www.w3schools.com/go/'], ['Kotlin', 'https://www.w3schools.com/kotlin/'], ['Swift', 'https://www.w3schools.com/swift/'], ['Rust', 'https://www.w3schools.com/rust/'], ['Introduction to Programming', 'https://www.w3schools.com/programming/'],
  ]},
  { group: 'Databases', items: [
    ['SQL', 'https://www.w3schools.com/sql/'], ['MySQL', 'https://www.w3schools.com/mysql/'], ['PostgreSQL', 'https://www.w3schools.com/postgresql/'], ['MongoDB', 'https://www.w3schools.com/mongodb/'],
  ]},
  { group: 'Data, AI & Computer Science', items: [
    ['Data Science', 'https://www.w3schools.com/datascience/'], ['Artificial Intelligence', 'https://www.w3schools.com/ai/'], ['Generative AI', 'https://www.w3schools.com/gen_ai/'], ['Machine Learning', 'https://www.w3schools.com/python/python_ml_getting_started.asp'], ['NumPy', 'https://www.w3schools.com/python/numpy/'], ['Pandas', 'https://www.w3schools.com/python/pandas/'], ['SciPy', 'https://www.w3schools.com/python/scipy/'], ['Matplotlib', 'https://www.w3schools.com/python/matplotlib_intro.asp'], ['Statistics', 'https://www.w3schools.com/statistics/'], ['DSA', 'https://www.w3schools.com/dsa/'],
  ]},
  { group: 'Tools, Cloud & Security', items: [
    ['Git', 'https://www.w3schools.com/git/'], ['Bash', 'https://www.w3schools.com/bash/'], ['Excel', 'https://www.w3schools.com/excel/'], ['AWS Cloud', 'https://www.w3schools.com/aws/'], ['Cyber Security', 'https://www.w3schools.com/cybersecurity/'], ['Raspberry Pi', 'https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp'], ['Web APIs', 'https://www.w3schools.com/js/js_api_intro.asp'],
  ]},
] as const;

export function LearningLibraryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const filteredCourses = useMemo(() => {
    const search = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCategory = category === 'All' || course.category === category;
      const searchable = `${course.name} ${course.summary} ${course.topics.join(' ')}`.toLowerCase();
      return matchesCategory && (!search || searchable.includes(search));
    });
  }, [category, query]);
  const filteredCatalog = useMemo(() => {
    const search = query.trim().toLowerCase();
    return learningCatalog.map((section) => ({ ...section, items: section.items.filter(([name]) => !search || name.toLowerCase().includes(search)) })).filter((section) => section.items.length);
  }, [query]);

  return (
    <div className="grid gap-5">
      <Card className="bg-gradient-to-br from-rush-blue/10 via-rush-ink to-rush-green/10">
        <div className="flex items-start gap-4">
          <BookOpen className="mt-1 h-9 w-9 shrink-0 text-rush-green" />
          <div>
            <p className="text-sm font-bold text-rush-green">IT Learning Library</p>
            <h1 className="mt-1 text-3xl font-black text-white">Learn the concept. Practice the syntax.</h1>
            <p className="mt-2 max-w-3xl text-slate-300">Browse beginner-friendly technology topics, identify the symbols to practice, then continue to the corresponding W3Schools tutorial for complete lessons and exercises.</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative">
            <span className="sr-only">Search library</span>
            <Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-11 pr-4" placeholder="Search a language or topic..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <div className="flex flex-wrap gap-2" aria-label="Course categories">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`focus-ring rounded-lg px-4 py-2 text-sm font-bold transition ${category === item ? 'bg-rush-green text-rush-ink' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}>{item}</button>)}
          </div>
        </div>
      </Card>

      {filteredCourses.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.name} className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-wide text-rush-green">{course.category}</p><h2 className="mt-1 text-2xl font-black text-white">{course.name}</h2></div>
              <span className="rounded-md bg-rush-blue/10 px-2 py-1 text-xs font-bold text-rush-blue">{course.level}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{course.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">{course.topics.map((topic) => <span key={topic} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">{topic}</span>)}</div>
            <div className="mt-4 rounded-lg border border-rush-green/20 bg-rush-green/10 p-3 text-sm"><strong className="text-rush-green">Typing focus:</strong> <span className="text-slate-200">{course.typingFocus}</span></div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <W3Link href={course.sourceUrl} label="Tutorial" />
              <W3Link href={`${course.sourceUrl}${course.sourceKey}_examples.asp`} label="Examples" />
              <W3Link href={`${course.sourceUrl}${course.sourceKey}_exercises.asp`} label="Exercises" />
            </div>
          </Card>
        ))}
      </div> : <Card><p className="text-center text-slate-300">No courses match your search.</p></Card>}

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-bold text-rush-green">Complete linked directory</p><h2 className="mt-1 text-2xl font-black text-white">All W3Schools Learning</h2></div>
          <span className="text-sm text-slate-400">{filteredCatalog.reduce((total, section) => total + section.items.length, 0)} resources</span>
        </div>
        {filteredCatalog.length ? <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCatalog.map((section) => <section key={section.group} className="rounded-lg border border-white/10 bg-white/5 p-4"><h3 className="font-black text-white">{section.group}</h3><div className="mt-3 grid gap-1">{section.items.map(([name, href]) => <a key={name} className="focus-ring flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white" href={href} target="_blank" rel="noreferrer"><span>{name}</span><ExternalLink className="h-3.5 w-3.5 shrink-0 text-rush-blue" /></a>)}</div></section>)}
        </div> : <p className="mt-5 text-center text-slate-300">No W3Schools resources match your search.</p>}
      </Card>

      <p className="text-center text-xs text-slate-500">TypeRush is not affiliated with W3Schools. Tutorial links open the original W3Schools website.</p>
    </div>
  );
}

function W3Link({ href, label }: { href: string; label: string }) {
  return <a className="focus-ring inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-rush-blue/50 bg-rush-blue/10 px-2 py-2 text-xs font-bold text-sky-100 transition hover:bg-rush-blue/20" href={href} target="_blank" rel="noreferrer">{label}<ExternalLink className="h-3.5 w-3.5" /></a>;
}
