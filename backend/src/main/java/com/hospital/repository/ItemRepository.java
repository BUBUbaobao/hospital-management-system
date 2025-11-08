package com.hospital.repository;

import com.hospital.entity.Item;
import com.hospital.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByEnabledTrue();

    List<Item> findByTypeAndEnabledTrue(ItemType type);
}
