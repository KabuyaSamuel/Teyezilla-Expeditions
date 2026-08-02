export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accommodations: {
        Row: {
          created_at: string | null
          description: string | null
          destination_id: string
          display_order: number | null
          hero_image: string | null
          id: string
          name: string
          slug: string | null
          status: string | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          destination_id: string
          display_order?: number | null
          hero_image?: string | null
          id?: string
          name: string
          slug?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          destination_id?: string
          display_order?: number | null
          hero_image?: string | null
          id?: string
          name?: string
          slug?: string | null
          status?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      affiliate_partners: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          status: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          status?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          status?: string | null
        }
        Relationships: []
      }
      attractions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          destination_id: string
          display_order: number | null
          hero_image: string | null
          id: string
          name: string
          slug: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          destination_id: string
          display_order?: number | null
          hero_image?: string | null
          id?: string
          name: string
          slug?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          destination_id?: string
          display_order?: number | null
          hero_image?: string | null
          id?: string
          name?: string
          slug?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attractions_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          answer: string | null
          author_bio: string | null
          author_name: string | null
          body: string | null
          body_blocks: Json | null
          category: string | null
          created_at: string | null
          destination_id: string | null
          excerpt: string | null
          hero_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          published_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          answer?: string | null
          author_bio?: string | null
          author_name?: string | null
          body?: string | null
          body_blocks?: Json | null
          category?: string | null
          created_at?: string | null
          destination_id?: string | null
          excerpt?: string | null
          hero_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          answer?: string | null
          author_bio?: string | null
          author_name?: string | null
          body?: string | null
          body_blocks?: Json | null
          category?: string | null
          created_at?: string | null
          destination_id?: string | null
          excerpt?: string | null
          hero_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_guests: {
        Row: {
          age_group: string | null
          booking_id: string
          dietary_requirements: string | null
          display_order: number | null
          full_name: string | null
          id: string
          nationality: string | null
          passport_number: string | null
        }
        Insert: {
          age_group?: string | null
          booking_id: string
          dietary_requirements?: string | null
          display_order?: number | null
          full_name?: string | null
          id?: string
          nationality?: string | null
          passport_number?: string | null
        }
        Update: {
          age_group?: string | null
          booking_id?: string
          dietary_requirements?: string | null
          display_order?: number | null
          full_name?: string | null
          id?: string
          nationality?: string | null
          passport_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_guests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          adults: number | null
          assigned_driver_id: string | null
          assigned_guide_id: string | null
          assigned_vehicle_id: string | null
          booking_reference: string
          booking_status: string | null
          budget_range: string | null
          children: number | null
          children_ages: string | null
          country_of_residence: string | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          deposit_amount: number | null
          flexible_dates: boolean | null
          id: string
          journey_id: string | null
          payment_status: string | null
          referral_source: string | null
          special_requests: string | null
          total_amount: number | null
          tour_id: string | null
          travel_date: string | null
          traveler_count: number
          updated_at: string | null
        }
        Insert: {
          adults?: number | null
          assigned_driver_id?: string | null
          assigned_guide_id?: string | null
          assigned_vehicle_id?: string | null
          booking_reference: string
          booking_status?: string | null
          budget_range?: string | null
          children?: number | null
          children_ages?: string | null
          country_of_residence?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          deposit_amount?: number | null
          flexible_dates?: boolean | null
          id?: string
          journey_id?: string | null
          payment_status?: string | null
          referral_source?: string | null
          special_requests?: string | null
          total_amount?: number | null
          tour_id?: string | null
          travel_date?: string | null
          traveler_count: number
          updated_at?: string | null
        }
        Update: {
          adults?: number | null
          assigned_driver_id?: string | null
          assigned_guide_id?: string | null
          assigned_vehicle_id?: string | null
          booking_reference?: string
          booking_status?: string | null
          budget_range?: string | null
          children?: number | null
          children_ages?: string | null
          country_of_residence?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          deposit_amount?: number | null
          flexible_dates?: boolean | null
          id?: string
          journey_id?: string | null
          payment_status?: string | null
          referral_source?: string | null
          special_requests?: string | null
          total_amount?: number | null
          tour_id?: string | null
          travel_date?: string | null
          traveler_count?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_assigned_guide_id_fkey"
            columns: ["assigned_guide_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_assigned_vehicle_id_fkey"
            columns: ["assigned_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_journeys: {
        Row: {
          collection_id: string
          display_order: number | null
          journey_id: string
        }
        Insert: {
          collection_id: string
          display_order?: number | null
          journey_id: string
        }
        Update: {
          collection_id?: string
          display_order?: number | null
          journey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_journeys_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_journeys_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_tours: {
        Row: {
          collection_id: string
          display_order: number | null
          tour_id: string
        }
        Insert: {
          collection_id: string
          display_order?: number | null
          tour_id: string
        }
        Update: {
          collection_id?: string
          display_order?: number | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_tours_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_tours_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          hero_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image: string | null
          slug: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hero_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image?: string | null
          slug: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hero_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image?: string | null
          slug?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          email: string
          emergency_contact: string | null
          full_name: string
          id: string
          loyalty_points: number | null
          nationality: string | null
          notes: string | null
          passport_info: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          emergency_contact?: string | null
          full_name: string
          id?: string
          loyalty_points?: number | null
          nationality?: string | null
          notes?: string | null
          passport_info?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          emergency_contact?: string | null
          full_name?: string
          id?: string
          loyalty_points?: number | null
          nationality?: string | null
          notes?: string | null
          passport_info?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      destination_regions: {
        Row: {
          destination_id: string
          region_id: string
        }
        Insert: {
          destination_id: string
          region_id: string
        }
        Update: {
          destination_id?: string
          region_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_regions_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "destination_regions_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          best_time_to_visit: string | null
          country_name: string
          created_at: string | null
          flag_emoji: string | null
          health_guidance: string | null
          hero_image: string | null
          id: string
          insurance_info: string | null
          is_launch_destination: boolean | null
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          overview: string | null
          packing_list: string | null
          short_description: string | null
          slug: string
          updated_at: string | null
          visa_info: string | null
        }
        Insert: {
          best_time_to_visit?: string | null
          country_name: string
          created_at?: string | null
          flag_emoji?: string | null
          health_guidance?: string | null
          hero_image?: string | null
          id?: string
          insurance_info?: string | null
          is_launch_destination?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          overview?: string | null
          packing_list?: string | null
          short_description?: string | null
          slug: string
          updated_at?: string | null
          visa_info?: string | null
        }
        Update: {
          best_time_to_visit?: string | null
          country_name?: string
          created_at?: string | null
          flag_emoji?: string | null
          health_guidance?: string | null
          hero_image?: string | null
          id?: string
          insurance_info?: string | null
          is_launch_destination?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          overview?: string | null
          packing_list?: string | null
          short_description?: string | null
          slug?: string
          updated_at?: string | null
          visa_info?: string | null
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string | null
          discount_type: string | null
          discount_value: number
          expires_at: string | null
          id: string
          is_referral: boolean | null
          usage_limit: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_type?: string | null
          discount_value: number
          expires_at?: string | null
          id?: string
          is_referral?: boolean | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_type?: string | null
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_referral?: boolean | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      experience_types: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          question: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          question: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          question?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          assigned_staff_id: string | null
          booking_id: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          journey_id: string | null
          message: string | null
          replied_at: string | null
          source: string | null
          staff_reply: string | null
          status: string | null
          tour_id: string | null
          trip_planner_request_id: string | null
        }
        Insert: {
          assigned_staff_id?: string | null
          booking_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          journey_id?: string | null
          message?: string | null
          replied_at?: string | null
          source?: string | null
          staff_reply?: string | null
          status?: string | null
          tour_id?: string | null
          trip_planner_request_id?: string | null
        }
        Update: {
          assigned_staff_id?: string | null
          booking_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          journey_id?: string | null
          message?: string | null
          replied_at?: string | null
          source?: string | null
          staff_reply?: string | null
          status?: string | null
          tour_id?: string | null
          trip_planner_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_trip_planner_request_id_fkey"
            columns: ["trip_planner_request_id"]
            isOneToOne: false
            referencedRelation: "trip_planner_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_accommodations: {
        Row: {
          accommodation_id: string
          display_order: number | null
          journey_id: string
        }
        Insert: {
          accommodation_id: string
          display_order?: number | null
          journey_id: string
        }
        Update: {
          accommodation_id?: string
          display_order?: number | null
          journey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_accommodations_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_accommodations_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_activities: {
        Row: {
          activity_id: string
          display_order: number | null
          journey_id: string
        }
        Insert: {
          activity_id: string
          display_order?: number | null
          journey_id: string
        }
        Update: {
          activity_id?: string
          display_order?: number | null
          journey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_activities_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_addons: {
        Row: {
          cta_label: string | null
          currency: string | null
          description: string | null
          display_order: number | null
          extra_days_max: number | null
          extra_days_min: number | null
          id: string
          journey_id: string
          kind: string
          price: number | null
          title: string
        }
        Insert: {
          cta_label?: string | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          extra_days_max?: number | null
          extra_days_min?: number | null
          id?: string
          journey_id: string
          kind: string
          price?: number | null
          title: string
        }
        Update: {
          cta_label?: string | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          extra_days_max?: number | null
          extra_days_min?: number | null
          id?: string
          journey_id?: string
          kind?: string
          price?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_addons_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_availability: {
        Row: {
          booked_count: number | null
          capacity: number
          date: string
          id: string
          journey_id: string | null
        }
        Insert: {
          booked_count?: number | null
          capacity: number
          date: string
          id?: string
          journey_id?: string | null
        }
        Update: {
          booked_count?: number | null
          capacity?: number
          date?: string
          id?: string
          journey_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_availability_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_destinations: {
        Row: {
          destination_id: string
          display_order: number | null
          is_primary: boolean
          journey_id: string
        }
        Insert: {
          destination_id: string
          display_order?: number | null
          is_primary?: boolean
          journey_id: string
        }
        Update: {
          destination_id?: string
          display_order?: number | null
          is_primary?: boolean
          journey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_destinations_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_experience_types: {
        Row: {
          experience_type_id: string
          journey_id: string
        }
        Insert: {
          experience_type_id: string
          journey_id: string
        }
        Update: {
          experience_type_id?: string
          journey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_experience_types_experience_type_id_fkey"
            columns: ["experience_type_id"]
            isOneToOne: false
            referencedRelation: "experience_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_experience_types_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_highlights: {
        Row: {
          description: string | null
          display_order: number | null
          id: string
          journey_id: string
          title: string
        }
        Insert: {
          description?: string | null
          display_order?: number | null
          id?: string
          journey_id: string
          title: string
        }
        Update: {
          description?: string | null
          display_order?: number | null
          id?: string
          journey_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_highlights_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_journey_types: {
        Row: {
          journey_id: string
          journey_type_id: string
        }
        Insert: {
          journey_id: string
          journey_type_id: string
        }
        Update: {
          journey_id?: string
          journey_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_journey_types_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_journey_types_journey_type_id_fkey"
            columns: ["journey_type_id"]
            isOneToOne: false
            referencedRelation: "journey_types"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_pricing_tiers: {
        Row: {
          accommodation_summary: string | null
          cta_label: string | null
          currency: string | null
          display_order: number | null
          features: string[] | null
          id: string
          journey_id: string
          price: number | null
          tagline: string | null
          tier_name: string
        }
        Insert: {
          accommodation_summary?: string | null
          cta_label?: string | null
          currency?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          journey_id: string
          price?: number | null
          tagline?: string | null
          tier_name: string
        }
        Update: {
          accommodation_summary?: string | null
          cta_label?: string | null
          currency?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          journey_id?: string
          price?: number | null
          tagline?: string | null
          tier_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_pricing_tiers_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_safari_themes: {
        Row: {
          journey_id: string
          safari_theme_id: string
        }
        Insert: {
          journey_id: string
          safari_theme_id: string
        }
        Update: {
          journey_id?: string
          safari_theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_safari_themes_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_safari_themes_safari_theme_id_fkey"
            columns: ["safari_theme_id"]
            isOneToOne: false
            referencedRelation: "safari_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_tours: {
        Row: {
          display_order: number | null
          journey_id: string
          tour_id: string
        }
        Insert: {
          display_order?: number | null
          journey_id: string
          tour_id: string
        }
        Update: {
          display_order?: number | null
          journey_id?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_tours_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_tours_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      journey_vehicles: {
        Row: {
          display_order: number | null
          journey_id: string
          vehicle_id: string
        }
        Insert: {
          display_order?: number | null
          journey_id: string
          vehicle_id: string
        }
        Update: {
          display_order?: number | null
          journey_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_vehicles_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      journeys: {
        Row: {
          availability_note: string | null
          best_for: string[] | null
          bring_list: string[] | null
          cancellation_policy: string | null
          created_at: string | null
          currency: string | null
          difficulty: string | null
          duration_days: number | null
          exclusions: string[] | null
          featured: boolean | null
          fitness_level: string | null
          food_and_drinks: string | null
          guide_info: string | null
          hero_image: string | null
          id: string
          important_info: string | null
          inclusions: string[] | null
          itinerary: Json | null
          languages: string[] | null
          max_guests: number | null
          meeting_point: string | null
          meta_description: string | null
          meta_title: string | null
          min_guests: number | null
          og_image: string | null
          overview: string | null
          pickup_locations: string[] | null
          price_from: number | null
          product_type: string | null
          short_description: string | null
          slug: string
          status: string | null
          teyezilla_moment: string | null
          title: string
          transportation: string | null
          updated_at: string | null
        }
        Insert: {
          availability_note?: string | null
          best_for?: string[] | null
          bring_list?: string[] | null
          cancellation_policy?: string | null
          created_at?: string | null
          currency?: string | null
          difficulty?: string | null
          duration_days?: number | null
          exclusions?: string[] | null
          featured?: boolean | null
          fitness_level?: string | null
          food_and_drinks?: string | null
          guide_info?: string | null
          hero_image?: string | null
          id?: string
          important_info?: string | null
          inclusions?: string[] | null
          itinerary?: Json | null
          languages?: string[] | null
          max_guests?: number | null
          meeting_point?: string | null
          meta_description?: string | null
          meta_title?: string | null
          min_guests?: number | null
          og_image?: string | null
          overview?: string | null
          pickup_locations?: string[] | null
          price_from?: number | null
          product_type?: string | null
          short_description?: string | null
          slug: string
          status?: string | null
          teyezilla_moment?: string | null
          title: string
          transportation?: string | null
          updated_at?: string | null
        }
        Update: {
          availability_note?: string | null
          best_for?: string[] | null
          bring_list?: string[] | null
          cancellation_policy?: string | null
          created_at?: string | null
          currency?: string | null
          difficulty?: string | null
          duration_days?: number | null
          exclusions?: string[] | null
          featured?: boolean | null
          fitness_level?: string | null
          food_and_drinks?: string | null
          guide_info?: string | null
          hero_image?: string | null
          id?: string
          important_info?: string | null
          inclusions?: string[] | null
          itinerary?: Json | null
          languages?: string[] | null
          max_guests?: number | null
          meeting_point?: string | null
          meta_description?: string | null
          meta_title?: string | null
          min_guests?: number | null
          og_image?: string | null
          overview?: string | null
          pickup_locations?: string[] | null
          price_from?: number | null
          product_type?: string | null
          short_description?: string | null
          slug?: string
          status?: string | null
          teyezilla_moment?: string | null
          title?: string
          transportation?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          booking_id: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          id: string
          points_delta: number
          reason: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          id?: string
          points_delta: number
          reason: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          id?: string
          points_delta?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          file_type: string | null
          file_url: string
          id: string
          storage_path: string | null
          tags: string[] | null
          uploaded_at: string | null
        }
        Insert: {
          alt_text?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          storage_path?: string | null
          tags?: string[] | null
          uploaded_at?: string | null
        }
        Update: {
          alt_text?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          storage_path?: string | null
          tags?: string[] | null
          uploaded_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          related_type: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          related_type?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          related_type?: string | null
          type?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          provider: string | null
          provider_reference: string | null
          status: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider?: string | null
          provider_reference?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider?: string | null
          provider_reference?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          hero_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hero_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hero_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean
          quote: string | null
          rating: number | null
          source: string | null
          tour_id: string | null
        }
        Insert: {
          author_name: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean
          quote?: string | null
          rating?: number | null
          source?: string | null
          tour_id?: string | null
        }
        Update: {
          author_name?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean
          quote?: string | null
          rating?: number | null
          source?: string | null
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      safari_themes: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          hero_image: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hero_image?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          hero_image?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          permissions: Json | null
          role: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          permissions?: Json | null
          role?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          permissions?: Json | null
          role?: string | null
        }
        Relationships: []
      }
      status_options: {
        Row: {
          category: string
          created_at: string | null
          display_order: number
          id: string
          key: string
          label: string
          tone: string
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number
          id?: string
          key: string
          label: string
          tone?: string
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number
          id?: string
          key?: string
          label?: string
          tone?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number | null
          full_name: string
          id: string
          photo: string | null
          role_title: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          full_name: string
          id?: string
          photo?: string | null
          role_title?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          full_name?: string
          id?: string
          photo?: string | null
          role_title?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tour_accommodations: {
        Row: {
          accommodation_id: string
          display_order: number | null
          tour_id: string
        }
        Insert: {
          accommodation_id: string
          display_order?: number | null
          tour_id: string
        }
        Update: {
          accommodation_id?: string
          display_order?: number | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_accommodations_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_accommodations_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_activities: {
        Row: {
          activity_id: string
          display_order: number | null
          tour_id: string
        }
        Insert: {
          activity_id: string
          display_order?: number | null
          tour_id: string
        }
        Update: {
          activity_id?: string
          display_order?: number | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_activities_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_addons: {
        Row: {
          cta_label: string | null
          currency: string | null
          description: string | null
          display_order: number | null
          extra_days_max: number | null
          extra_days_min: number | null
          id: string
          kind: string
          price: number | null
          title: string
          tour_id: string
        }
        Insert: {
          cta_label?: string | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          extra_days_max?: number | null
          extra_days_min?: number | null
          id?: string
          kind: string
          price?: number | null
          title: string
          tour_id: string
        }
        Update: {
          cta_label?: string | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          extra_days_max?: number | null
          extra_days_min?: number | null
          id?: string
          kind?: string
          price?: number | null
          title?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_addons_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_availability: {
        Row: {
          booked_count: number | null
          capacity: number
          date: string
          id: string
          tour_id: string | null
        }
        Insert: {
          booked_count?: number | null
          capacity: number
          date: string
          id?: string
          tour_id?: string | null
        }
        Update: {
          booked_count?: number | null
          capacity?: number
          date?: string
          id?: string
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_availability_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_experience_types: {
        Row: {
          experience_type_id: string
          tour_id: string
        }
        Insert: {
          experience_type_id: string
          tour_id: string
        }
        Update: {
          experience_type_id?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_experience_types_experience_type_id_fkey"
            columns: ["experience_type_id"]
            isOneToOne: false
            referencedRelation: "experience_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_experience_types_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_highlights: {
        Row: {
          description: string | null
          display_order: number | null
          id: string
          title: string
          tour_id: string
        }
        Insert: {
          description?: string | null
          display_order?: number | null
          id?: string
          title: string
          tour_id: string
        }
        Update: {
          description?: string | null
          display_order?: number | null
          id?: string
          title?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_highlights_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_pricing_tiers: {
        Row: {
          accommodation_summary: string | null
          cta_label: string | null
          currency: string | null
          display_order: number | null
          features: string[] | null
          id: string
          price: number | null
          tagline: string | null
          tier_name: string
          tour_id: string
        }
        Insert: {
          accommodation_summary?: string | null
          cta_label?: string | null
          currency?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          price?: number | null
          tagline?: string | null
          tier_name: string
          tour_id: string
        }
        Update: {
          accommodation_summary?: string | null
          cta_label?: string | null
          currency?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          price?: number | null
          tagline?: string | null
          tier_name?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_pricing_tiers_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_safari_themes: {
        Row: {
          safari_theme_id: string
          tour_id: string
        }
        Insert: {
          safari_theme_id: string
          tour_id: string
        }
        Update: {
          safari_theme_id?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_safari_themes_safari_theme_id_fkey"
            columns: ["safari_theme_id"]
            isOneToOne: false
            referencedRelation: "safari_themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_safari_themes_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_vehicles: {
        Row: {
          display_order: number | null
          tour_id: string
          vehicle_id: string
        }
        Insert: {
          display_order?: number | null
          tour_id: string
          vehicle_id: string
        }
        Update: {
          display_order?: number | null
          tour_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_vehicles_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          availability_note: string | null
          best_for: string[] | null
          bring_list: string[] | null
          cancellation_policy: string | null
          category_label: string | null
          created_at: string | null
          currency: string | null
          destination_id: string | null
          difficulty: string | null
          duration_days: number | null
          duration_hours: number | null
          exclusions: string[] | null
          featured: boolean | null
          fitness_level: string | null
          food_and_drinks: string | null
          guide_info: string | null
          hero_image: string | null
          id: string
          important_info: string | null
          inclusions: string[] | null
          itinerary: Json | null
          languages: string[] | null
          max_guests: number | null
          meeting_point: string | null
          meta_description: string | null
          meta_title: string | null
          min_guests: number | null
          og_image: string | null
          overview: string | null
          pickup_locations: string[] | null
          price_from: number | null
          product_type: string | null
          short_description: string | null
          slug: string
          status: string | null
          teyezilla_moment: string | null
          title: string
          transportation: string | null
          updated_at: string | null
        }
        Insert: {
          availability_note?: string | null
          best_for?: string[] | null
          bring_list?: string[] | null
          cancellation_policy?: string | null
          category_label?: string | null
          created_at?: string | null
          currency?: string | null
          destination_id?: string | null
          difficulty?: string | null
          duration_days?: number | null
          duration_hours?: number | null
          exclusions?: string[] | null
          featured?: boolean | null
          fitness_level?: string | null
          food_and_drinks?: string | null
          guide_info?: string | null
          hero_image?: string | null
          id?: string
          important_info?: string | null
          inclusions?: string[] | null
          itinerary?: Json | null
          languages?: string[] | null
          max_guests?: number | null
          meeting_point?: string | null
          meta_description?: string | null
          meta_title?: string | null
          min_guests?: number | null
          og_image?: string | null
          overview?: string | null
          pickup_locations?: string[] | null
          price_from?: number | null
          product_type?: string | null
          short_description?: string | null
          slug: string
          status?: string | null
          teyezilla_moment?: string | null
          title: string
          transportation?: string | null
          updated_at?: string | null
        }
        Update: {
          availability_note?: string | null
          best_for?: string[] | null
          bring_list?: string[] | null
          cancellation_policy?: string | null
          category_label?: string | null
          created_at?: string | null
          currency?: string | null
          destination_id?: string | null
          difficulty?: string | null
          duration_days?: number | null
          duration_hours?: number | null
          exclusions?: string[] | null
          featured?: boolean | null
          fitness_level?: string | null
          food_and_drinks?: string | null
          guide_info?: string | null
          hero_image?: string | null
          id?: string
          important_info?: string | null
          inclusions?: string[] | null
          itinerary?: Json | null
          languages?: string[] | null
          max_guests?: number | null
          meeting_point?: string | null
          meta_description?: string | null
          meta_title?: string | null
          min_guests?: number | null
          og_image?: string | null
          overview?: string | null
          pickup_locations?: string[] | null
          price_from?: number | null
          product_type?: string | null
          short_description?: string | null
          slug?: string
          status?: string | null
          teyezilla_moment?: string | null
          title?: string
          transportation?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_planner_requests: {
        Row: {
          ai_suggested_itinerary: string | null
          budget_usd: number | null
          created_at: string | null
          customer_email: string
          customer_name: string
          days: number | null
          destination: string | null
          extras: string[] | null
          id: string
          luxury_level: string | null
          status: string | null
          travel_style: string | null
          travelers: number | null
        }
        Insert: {
          ai_suggested_itinerary?: string | null
          budget_usd?: number | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          days?: number | null
          destination?: string | null
          extras?: string[] | null
          id?: string
          luxury_level?: string | null
          status?: string | null
          travel_style?: string | null
          travelers?: number | null
        }
        Update: {
          ai_suggested_itinerary?: string | null
          budget_usd?: number | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          days?: number | null
          destination?: string | null
          extras?: string[] | null
          id?: string
          luxury_level?: string | null
          status?: string | null
          travel_style?: string | null
          travelers?: number | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          features: string[] | null
          id: string
          image: string | null
          name: string
          seats: number | null
          slug: string
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          image?: string | null
          name: string
          seats?: number | null
          slug: string
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          id?: string
          image?: string | null
          name?: string
          seats?: number | null
          slug?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_loyalty_transaction: {
        Args: {
          p_booking_id?: string
          p_created_by?: string
          p_customer_id: string
          p_points_delta: number
          p_reason: string
        }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
