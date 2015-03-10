<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /functions sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::get_context();
$post = Timber::query_post();
$context['post'] = $post;
$context['wp_title'] .= ' - ' . $post->title();
$product_link =  icl_object_id(158, 'page', true);
$context['product_page'] = get_permalink($product_link);

Timber::render(array('single-product' . $post->ID . '.twig', 'single-product' . $post->post_type . '.twig', 'single-product.twig'), $context);


