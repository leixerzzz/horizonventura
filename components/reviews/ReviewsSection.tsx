"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const reviews = [
	{
		name: "Sarah M.",
		country: "us",
		photo: "/reviews/1.jpg",
		text: "Best travel experience of my life. Horizon Ventura is unreal.",
	},
	{
		name: "Carlos R.",
		country: "es",
		photo: "/reviews/2.jpg",
		text: "Increíble servicio, todo perfecto desde el primer día.",
	},
];

export default function ReviewsSection() {
	const t = useTranslations?.("Reviews");
	const reduceMotion = useReducedMotion();

	const title = t?.("title") ?? "Reviews";

	return (
		<section
			className="py-24 bg-gray-50 dark:bg-night"
			role="region"
			aria-label={title}
		>
			<h2 className="text-4xl font-bold text-center mb-12">{title}</h2>

			<div
				className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6"
				role="list"
			>
				{reviews.map((review, i) => (
					<motion.div
						key={`${review.name}-${i}`}
						whileHover={reduceMotion ? undefined : { scale: 1.03 }}
						className="bg-white dark:bg-white/10 p-6 rounded-2xl shadow-lg flex gap-4"
						role="listitem"
						aria-label={`${review.name} review`}
					>
						<img
							src={review.photo}
							className="w-16 h-16 rounded-full object-cover"
							alt={`${review.name} photo`}
							loading="lazy"
							draggable={false}
						/>
						<div>
							<div className="flex items-center gap-2 mb-1">
								<h4 className="font-bold">{review.name}</h4>
								<img
									src={`/flags/${review.country}.svg`}
									className="w-5"
									alt={`${review.country} flag`}
								/>
							</div>
							<p>{review.text}</p>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}