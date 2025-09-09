import Layout from "@/components/Layout";
import Link from "next/link";
import { BookOpenIcon, BeakerIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Welcome to
            <span className="text-blue-600"> Training System</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Modern training platform based on Slidev architecture. Create, manage, and deliver interactive presentations and courses.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/courses" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Get started
            </Link>
            <Link href="/labs" className="text-sm font-semibold leading-6 text-gray-900">
              Explore Labs <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-16 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for modern training
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Built with NextJS and FastAPI for maximum flexibility and performance
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col text-center">
                  <dt className="flex items-center justify-center text-base font-semibold leading-7 text-gray-900">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600 mx-auto">
                      <BookOpenIcon className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="font-semibold text-gray-900 mb-2">Courses & Labs</p>
                    <p className="flex-auto">Create engaging presentations with markdown support, code highlighting, and hands-on laboratory exercises.</p>
                  </dd>
                </div>

                <div className="flex flex-col text-center">
                  <dt className="flex items-center justify-center text-base font-semibold leading-7 text-gray-900">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-green-600 mx-auto">
                      <BeakerIcon className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="font-semibold text-gray-900 mb-2">Practical Learning</p>
                    <p className="flex-auto">Master skills through step-by-step lab exercises with detailed instructions and acceptance criteria.</p>
                  </dd>
                </div>

                <div className="flex flex-col text-center">
                  <dt className="flex items-center justify-center text-base font-semibold leading-7 text-gray-900">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-600 mx-auto">
                      <UserGroupIcon className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="font-semibold text-gray-900 mb-2">Collaboration</p>
                    <p className="flex-auto">Share courses with team members and track learning progress across your organization.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
