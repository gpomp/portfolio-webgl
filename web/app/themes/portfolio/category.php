<?php

global $paged;
global $params;
if (!isset($paged) || !$paged){
    $paged = 1;
}

if(isset($params['paged'])) {
	$paged = $params['paged'];
}

if(isset($params['category'])) {
	$category = get_category_by_slug($params['category']);
}

/*Get news custom posts + categories*/

$context = Timber::get_context();

$args = array(
	'post_type' => 'news',
	'posts_per_page' => 5,
	'paged' => $paged,
	'category__in' => array($category->term_id)
);
query_posts($args);
$context['categories'] = Timber::get_terms('category');

$posts = Timber::get_posts($args);

$context['post'] = new TimberPost();

$context['posts'] = $posts;

/*Get news page banner*/
$post_news = new TimberPost(157);
$context['post_news'] = $post_news;

$context['pagination'] = Timber::get_pagination();

Timber::render('category.twig', $context);