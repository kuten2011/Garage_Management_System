package DACNTT.garage.repository;

import DACNTT.garage.model.ServiceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceInfoRepository extends JpaRepository<ServiceInfo, Long> {
    List<ServiceInfo> findByCategory(String category);
    List<ServiceInfo> findByTitleContainingIgnoreCase(String title);
    List<ServiceInfo> findByContentContainingIgnoreCase(String content);

    // Full-text search
    @Query(value = """
        SELECT * FROM "ThongTinDichVu"
        WHERE to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content) 
              @@ plainto_tsquery('english', :query)
        ORDER BY ts_rank(
            to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content),
            plainto_tsquery('english', :query)
        ) DESC
        LIMIT :limit
    """, nativeQuery = true)
    List<ServiceInfo> fullTextSearch(
            @Param("query") String query,
            @Param("limit") int limit
    );

    // ========== VECTOR SEARCH (pgvector) ==========

    // Vector similarity search với pgvector
    @Query(value = """
        SELECT * FROM "ThongTinDichVu"
        WHERE embedding IS NOT NULL
        ORDER BY embedding <-> CAST(:embedding AS vector)
        LIMIT :limit
    """, nativeQuery = true)
    List<ServiceInfo> searchByVectorSimilarity(
            @Param("embedding") String embedding,
            @Param("limit") int limit
    );

    // Vector search với threshold
    @Query(value = """
        SELECT * FROM "ThongTinDichVu"
        WHERE embedding IS NOT NULL
          AND 1 - (embedding <-> CAST(:embedding AS vector)) >= :threshold
        ORDER BY embedding <-> CAST(:embedding AS vector)
        LIMIT :limit
    """, nativeQuery = true)
    List<ServiceInfo> searchByVectorWithThreshold(
            @Param("embedding") String embedding,
            @Param("threshold") double threshold,
            @Param("limit") int limit
    );

    // ========== HYBRID SEARCH ==========

    // Hybrid search: Kết hợp keyword và vector search
    @Query(value = """
        WITH keyword_results AS (
            SELECT id, 
                   ROW_NUMBER() OVER (ORDER BY 
                       ts_rank(
                           to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content),
                           plainto_tsquery('english', :query)
                       ) DESC
                   ) as rank
            FROM "ThongTinDichVu"
            WHERE to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content) 
                  @@ plainto_tsquery('english', :query)
            LIMIT 50
        ),
        vector_results AS (
            SELECT id,
                   ROW_NUMBER() OVER (ORDER BY embedding <-> CAST(:embedding AS vector)) as rank
            FROM "ThongTinDichVu"
            WHERE embedding IS NOT NULL
            LIMIT 50
        ),
        combined AS (
            SELECT COALESCE(k.id, v.id) as id,
                   COALESCE(1.0 / (60 + k.rank), 0) + COALESCE(1.0 / (60 + v.rank), 0) as score
            FROM keyword_results k
            FULL OUTER JOIN vector_results v ON k.id = v.id
        )
        SELECT s.* 
        FROM "ThongTinDichVu" s
        JOIN combined c ON s.id = c.id
        ORDER BY c.score DESC
        LIMIT :limit
    """, nativeQuery = true)
    List<ServiceInfo> hybridSearch(
            @Param("query") String query,
            @Param("embedding") String embedding,
            @Param("limit") int limit
    );

    // Hybrid search đơn giản hơn: Weighted combination
    @Query(value = """
        SELECT s.*, 
               (:keywordWeight * ts_rank(
                   to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content),
                   plainto_tsquery('english', :query)
               )) + 
               (:vectorWeight * (1 - (embedding <-> CAST(:embedding AS vector)))) as combined_score
        FROM "ThongTinDichVu" s
        WHERE (to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || content) 
               @@ plainto_tsquery('english', :query)
               OR embedding IS NOT NULL)
        ORDER BY combined_score DESC
        LIMIT :limit
    """, nativeQuery = true)
    List<ServiceInfo> weightedHybridSearch(
            @Param("query") String query,
            @Param("embedding") String embedding,
            @Param("keywordWeight") double keywordWeight,
            @Param("vectorWeight") double vectorWeight,
            @Param("limit") int limit
    );
}
