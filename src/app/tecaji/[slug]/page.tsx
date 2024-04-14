import { strapiFunctions } from '@/api';
import { CourseList } from '../course-list';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params: { slug },
}: CoursePageProps): Promise<Metadata> {
  const course = (await strapiFunctions.getCourseBySlug(slug))?.attributes;

  if (!course) {
    throw new Error('Course not found');
  }

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
    },
  };
}

export default async function CoursesPage({
  params: { slug },
}: CoursePageProps) {
  const course = (await strapiFunctions.getCourseBySlug(slug))?.attributes;

  if (!course) {
    notFound();
  }

  const parent = course.parent?.data;

  return (
    <div className="section container max-w-[65ch]">
      {parent ? (
        <Link
          href={`/tecaji/${parent.attributes.slug}`}
          className="btn btn-link p-0"
        >
          <FontAwesomeIcon icon={faArrowLeft} height={18} width={16} />
          {parent.attributes.title}
        </Link>
      ) : (
        <Link href="/tecaji" className="btn btn-link p-0">
          <FontAwesomeIcon icon={faArrowLeft} height={18} width={16} />
          Tečaji
        </Link>
      )}

      <div className="prose mb-8">
        <h1>{course.title}</h1>
        {course.description && <p>{course.description}</p>}
      </div>

      <CourseList
        courses={course.subcourses?.data}
        articles={course.articles?.data}
      />
    </div>
  );
}
